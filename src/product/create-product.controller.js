import uploadImage from "../util/upload-img.js";
import Product from "./product.model.js";
export default async function CreateProducts(req, res) {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, price, description, stock, condition, minOrderQuantity } =
      req.body;

    const photo = req.file ? req.file.path : null;

    if (
      !photo ||
      !name ||
      !price ||
      !description ||
      !stock ||
      !condition ||
      !minOrderQuantity
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    try {
      const newProduct = new Product({
        photo,
        name,
        price,
        description,
        stock,
        condition,
        minOrderQuantity,
        owner: req.user._id,
      });

      await newProduct.save();
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  });
}

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(201).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
