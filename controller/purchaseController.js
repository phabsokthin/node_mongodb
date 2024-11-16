import { Product } from "../models/Product.js";

export const createPurchase = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  if (!qty) {
    return res.status(400).json({ message: "Quantity (qty) must be provided." });
  }

  try {
    if (qty <= 0) {
      return res.status(400).json({ message: "Quantity (qty) must be greater than zero." });
    }

    const newPurchase = {
      qty,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { purchases: newPurchase },
        $inc: { qty: qty }, 
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const total = updatedProduct.price * updatedProduct.qty;

    updatedProduct.total = total;
    await updatedProduct.save();

    return res.status(200).json({
      message: "Purchase successful.",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error creating purchase:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};



export const updatePurchase = async (req, res) => {
  const { productId, purchaseId } = req.params;
  const { qty } = req.body; 

  if (!qty) {
    return res.status(400).json({ message: "Quantity must be provided." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const purchaseIndex = product.purchases.findIndex(
      (purchase) => purchase._id.toString() === purchaseId
    );

    if (purchaseIndex === -1) {
      return res.status(404).json({ message: "Purchase not found." });
    }

    const oldQty = product.purchases[purchaseIndex].qty;

    product.purchases[purchaseIndex].qty = qty;
    product.purchases[purchaseIndex].updatedAt = new Date();

    const updatedQty = product.qty - oldQty + qty;

    const updatedTotal = product.price * updatedQty;

    product.qty = updatedQty;
    product.total = updatedTotal;
    await product.save();

    return res.status(200).json({
      message: "Purchase updated successfully.",
      product,
    });
  } catch (err) {
    console.error("Error updating purchase:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};



export const deletePurchase = async (req, res) => {
  const { productId, purchaseId } = req.params;

  try {
   
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const purchaseToDelete = product.purchases.find(
      (purchase) => purchase._id.toString() === purchaseId
    );

    if (!purchaseToDelete) {
      return res.status(404).json({ message: "Purchase not found." });
    }

    const updatedQty = product.qty - purchaseToDelete.qty;

   
    const updatedTotal = product.price * updatedQty;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { purchases: { _id: purchaseId } }, // Remove the purchase
        $set: { qty: updatedQty, total: updatedTotal }, // Update qty and total
      },
      { new: true } 
    );

    return res.status(200).json({
      message: "Purchase deleted successfully.",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error deleting purchase:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};