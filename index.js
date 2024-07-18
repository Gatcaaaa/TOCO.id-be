import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {} from "./src/config/database.connect.js";
import authRoutes from "./src/auth/auth.routes.js";
import otpRoutes from "./src/otp-verification/otp-verification.routes.js";
import productRoutes from "./src/product/product.routes.js";

dotenv.config();

const service = express();
const port = 4000;
service.use(cors());

service.use(express.json());
service.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "./src/images");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

service.use("/api/auth", authRoutes);
service.use("/api/auth", otpRoutes);
service.use("/api/products", productRoutes);

service.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
