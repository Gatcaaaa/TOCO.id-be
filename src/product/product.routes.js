import express from "express";
import createProductController from "./create-product.controller.js";
import getProductController from "./get-product.controller.js";
import deleteProductController from "./delete-product.controller.js";
import putProductController from "./put-product.controller.js";
import patchProductController from "./patch-product.controller.js";
import authenticate from "../middleware/authenticate.js";

const routes = express.Router();

routes.post("/products", authenticate, createProductController);
routes.get("/products", authenticate, getProductController);
routes.delete("/products", authenticate, deleteProductController);
routes.put("/products", authenticate, putProductController);
routes.patch("/products", authenticate, patchProductController);

export default routes;
