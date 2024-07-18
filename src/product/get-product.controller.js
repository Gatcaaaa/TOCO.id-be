import Product from "./product.model.js";

export default async function GetProducts(req, res) {
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
}
