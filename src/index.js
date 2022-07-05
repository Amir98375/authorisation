const express = require("express");

const connect = require("./configs/db");

const userController = require("./controllers/user.controller");
const productController = require("./controllers/product.controller");
const { register, login,loggedUser,registerUpdate } = require("./controllers/auth.controller");
const authenticate = require("./middlewares/authenticate")

const passport = require("./configs/google-oauth");
const router = require("./controllers/user.controller");

const app = express();

app.use(express.json());

// /register
app.post("/register", register);
// .login
app.post("/login", login);
app.get("/loggedUser",authenticate,loggedUser)

app.patch("/registerUpdate/:id",authenticate,registerUpdate )


app.use("/users", userController);
app.use("/products", productController);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    const { user } = req;
    const token = newToken(user);

    return res.send({ user, token });
  }
);

app.listen(2345, async () => {
  try {
    await connect();
  } catch (err) {
    console.error(err.message);
  }
  console.log("listening on port 2345");
});
