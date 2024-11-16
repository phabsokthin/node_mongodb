
import mongoose from "mongoose";

import { Product } from "../models/Product.js";


//sel one by one
export const sellProduct = async (req, res) => {
    const { productId } = req.params;
    const { qty, details } = req.body;

    if (!qty) {
        return res.status(400).json({ message: "Quantity (qty) must be provided." });
    }

    try {
        if (qty <= 0) {
            return res.status(400).json({ message: "Quantity (qty) must be greater than zero." });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.qty < qty) {
            return res.status(400).json({ message: "Insufficient stock for the sale." });
        }

        // Create new sell entry
        const newSell = {
            qty,
            details: details || "", // Optional sale details
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Reduce the qty and calculate the new total
        const updatedQty = product.qty - qty;
        const updatedTotal = updatedQty * product.price;

        // Update product
        product.qty = updatedQty;
        product.total = updatedTotal;

        // Push the sale into the sells array
        product.sells.push(newSell);

        await product.save();

        return res.status(200).json({
            message: "Sale successful.",
            product,
        });
    } catch (err) {
        console.error("Error processing sale:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

//sell multty
export const sellMultipleProducts = async (req, res) => {
  const { products } = req.body; // Expecting an array of { productId, qty, details }

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "Products must be provided." });
  }

  // Start a MongoDB transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const soldProducts = [];
    
    for (let item of products) {
      const { productId, qty, details } = item;

      if (!qty || qty <= 0) {
        throw new Error("Quantity must be greater than zero.");
      }

      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      if (product.qty < qty) {
        throw new Error(`Insufficient stock for product: ${product.pname}.`);
      }
      // Create new sell entry
      const newSell = {
        qty,
        details: details || "", // Optional sale details
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Reduce the qty and calculate the new total
      const updatedQty = product.qty - qty;
      const updatedTotal = updatedQty * product.price;

      // Update product stock and total
      product.qty = updatedQty;
      product.total = updatedTotal;

      // Push the sale into the sells array
      product.sells.push(newSell);

      // Save the product within the session
      await product.save({ session });

      soldProducts.push(product); // Keep track of all updated products
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Sale successful.",
      products: soldProducts, // Return the updated products
    });

  } catch (err) {
    // Abort the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    console.error("Error processing sale:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

