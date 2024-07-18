import express from "express";
import verifyOTP from "./otp-verification.controller.js";
import newOTP from "./new-otp.controller.js";

const routes = express.Router();

routes.post("/verify-otp", verifyOTP);
routes.post("/new-otp", newOTP);

export default routes;
