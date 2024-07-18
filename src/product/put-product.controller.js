import uploadImage from "../util/upload-img.js";
import Product from "./product.model.js";
import fs from "fs";
import path from "path";

export default async function PutProducts(req, res) {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const productId = req.params.id;
    const { name, price, description, stock, condition, minOrderQuantity } =
      req.body;

    if (
      !name ||
      !price ||
      !description ||
      !stock ||
      !condition ||
      !minOrderQuantity ||
      (!req.file && !req.body.photo)
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const oldPhotoPath = product.photo;
      product.photo = req.file ? req.file.path : product.photo;
      product.name = name;
      product.price = price;
      product.description = description;
      product.stock = stock;
      product.condition = condition;
      product.minOrderQuantity = minOrderQuantity;

      await product.save();

      if (req.file && oldPhotoPath) {
        fs.unlink(path.resolve(oldPhotoPath), (err) => {
          if (err) console.error(err);
          console.log("Product photo deleted successfully");
        });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  });
}
