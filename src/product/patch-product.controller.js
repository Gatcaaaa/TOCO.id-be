import fs from "fs";
import path from "path";
import uploadImage from "../util/upload-img.js";
import Product from "./product.model.js";

export default async function PatchProduct(req, res) {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const productId = req.params.id;
    const { name, price, description, stock, condition, minOrderQuantity } =
      req.body;

    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const oldPhotoPath = product.photo;

      if (req.file) {
        product.photo = req.file.path;
      }
      if (name) product.name = name;
      if (price) product.price = price;
      if (description) product.description = description;
      if (stock) product.stock = stock;
      if (condition) product.condition = condition;
      if (minOrderQuantity) product.minOrderQuantity = minOrderQuantity;

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
