// Run with:  npm test
// Tests the real routes / JWT / bcrypt code. Mongoose models are replaced with
// small in-memory fakes, so no MongoDB is needed to run this.
const test = require("node:test");
const assert = require("node:assert");
const path = require("path");

process.env.JWT_SECRET = "test-secret";

// ---------- in-memory fakes ----------
let seq = 0;
const newId = () => (++seq).toString(16).padStart(24, "0");
const isId = (v) => /^[0-9a-f]{24}$/.test(String(v));
const castCheck = (id) => {
  if (!isId(id)) { const e = new Error("Cast"); e.name = "CastError"; throw e; }
};
const query = (fn) => {
  const q = { select: () => q, sort: () => q, then: (res, rej) => Promise.resolve().then(fn).then(res, rej) };
  return q;
};

const users = [];
const User = {
  findOne: ({ email }) => query(() => users.find((u) => u.email === email) || null),
  findById: (id) => query(() => users.find((u) => u._id === id) || null),
  create: async (data) => {
    const u = { _id: newId(), ...data, profile: { ...(data.profile || {}) }, save: async () => u };
    users.push(u);
    return u;
  },
};

const workouts = [];
const serialize = (w) => { const { _id, userId, ...rest } = w; return { id: _id, ...rest }; };
const wrap = (w) => w && { ...w, toJSON: () => serialize(w) };
const Workout = {
  find: ({ userId }) => query(() => workouts.filter((w) => w.userId === userId).reverse().map(wrap)),
  create: async (data) => {
    const w = { _id: newId(), date: "2026-01-01", ...data };
    workouts.push(w);
    return wrap(w);
  },
  findOneAndUpdate: ({ _id, userId }, update) => query(() => {
    castCheck(_id);
    const w = workouts.find((x) => x._id === _id && x.userId === userId);
    return w ? wrap(Object.assign(w, update)) : null;
  }),
  findOneAndDelete: ({ _id, userId }) => query(() => {
    castCheck(_id);
    const i = workouts.findIndex((x) => x._id === _id && x.userId === userId);
    return i === -1 ? null : wrap(workouts.splice(i, 1)[0]);
  }),
};

const inject = (file, exp) => {
  const p = require.resolve(path.join("..", "models", file));
  require.cache[p] = { id: p, filename: p, loaded: true, exports: exp };
};
inject("User.js", User);
inject("Workout.js", Workout);

// ---------- tests ----------
const createApp = require("../createApp");
let server, base;

test.before(async () => {
  await new Promise((r) => { server = createApp().listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

const call = async (method, url, body, token) => {
  const res = await fetch(base + url, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
};

let tokenA, tokenB, workoutId;

test("register validates input", async () => {
  assert.equal((await call("POST", "/api/auth/register", { name: "", email: "a@b.com", password: "secret1" })).status, 400);
  assert.equal((await call("POST", "/api/auth/register", { name: "A", email: "nope", password: "secret1" })).status, 400);
  assert.equal((await call("POST", "/api/auth/register", { name: "A", email: "a@b.com", password: "123" })).status, 400);
});

test("register creates account, returns token, hides password", async () => {
  const r = await call("POST", "/api/auth/register",
    { name: "Ann", email: "Ann@Test.com", password: "secret12", profile: { age: 20, goal: "Muscle Gain" } });
  assert.equal(r.status, 201);
  assert.ok(r.body.token);
  assert.equal(r.body.user.email, "ann@test.com");
  assert.equal(r.body.user.profile.goal, "Muscle Gain");
  assert.equal(JSON.stringify(r.body).includes("passwordHash"), false);
  tokenA = r.body.token;
});

test("passwords are stored hashed, not plain", () => {
  assert.notEqual(users[0].passwordHash, "secret12");
  assert.match(users[0].passwordHash, /^\$2[aby]\$/);
});

test("duplicate email is rejected (409)", async () => {
  const r = await call("POST", "/api/auth/register", { name: "Ann", email: "ann@test.com", password: "secret12" });
  assert.equal(r.status, 409);
});

test("login: wrong password / unknown email / success", async () => {
  assert.equal((await call("POST", "/api/auth/login", { email: "ann@test.com", password: "bad" })).status, 401);
  assert.equal((await call("POST", "/api/auth/login", { email: "who@test.com", password: "secret12" })).status, 401);
  const ok = await call("POST", "/api/auth/login", { email: "ANN@test.com", password: "secret12" });
  assert.equal(ok.status, 200);
  assert.ok(ok.body.token);
});

test("protected routes need a valid token", async () => {
  assert.equal((await call("GET", "/api/workouts")).status, 401);
  assert.equal((await call("GET", "/api/workouts", null, "garbage")).status, 401);
  assert.equal((await call("GET", "/api/auth/me", null, tokenA)).status, 200);
});

test("profile update works", async () => {
  const r = await call("PUT", "/api/auth/profile", { weight: 61, level: "Advanced", hacker: "x" }, tokenA);
  assert.equal(r.status, 200);
  assert.equal(r.body.user.profile.weight, "61");
  assert.equal(r.body.user.profile.level, "Advanced");
  assert.equal("hacker" in r.body.user.profile, false);
});

test("workouts: create, validate, list, delete", async () => {
  assert.equal((await call("POST", "/api/workouts", { name: "" }, tokenA)).status, 400);
  const c = await call("POST", "/api/workouts", { name: "Push-ups", calories: 120, minutes: 10 }, tokenA);
  assert.equal(c.status, 201);
  assert.ok(c.body.id);
  workoutId = c.body.id;
  const list = await call("GET", "/api/workouts", null, tokenA);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].name, "Push-ups");
});

test("users cannot see or delete each other's workouts", async () => {
  const b = await call("POST", "/api/auth/register", { name: "Bob", email: "bob@test.com", password: "secret12" });
  tokenB = b.body.token;
  assert.equal((await call("GET", "/api/workouts", null, tokenB)).body.length, 0);
  assert.equal((await call("DELETE", `/api/workouts/${workoutId}`, null, tokenB)).status, 404);
  assert.equal((await call("GET", "/api/workouts", null, tokenA)).body.length, 1);
});

test("delete own workout + bad id handled", async () => {
  assert.equal((await call("DELETE", "/api/workouts/not-an-id", null, tokenA)).status, 404);
  assert.equal((await call("DELETE", `/api/workouts/${workoutId}`, null, tokenA)).status, 200);
  assert.equal((await call("GET", "/api/workouts", null, tokenA)).body.length, 0);
});
