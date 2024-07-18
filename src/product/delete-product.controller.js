import fs from "fs";
import path from "path";
import Product from "./product.model.js";

export default async function DeleteProducts(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const getPhotoPath = product.photo;
    await product.deleteOne();

    if (getPhotoPath) {
      fs.unlink(path.resolve(getPhotoPath), (err) => {
        if (err) console.error(err);
        console.log("Product photo deleted successfully");
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
