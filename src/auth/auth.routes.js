import express from "express";
import signupController from "./signup.controller.js";
import signinController from "./signin.controller.js";

const routes = express.Router();

routes.post("/signup", signupController);
routes.post("/signin", signinController);

export default routes;
