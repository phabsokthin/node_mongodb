import mongoose from "mongoose";
import { Product } from "../models/Product.js";


export const returnMultipleSales = async (req, res) => {
    const { returns } = req.body; // Expecting an array of { productId, saleId, qty, reason }
  
    if (!returns || returns.length === 0) {
      return res.status(400).json({ message: "Sale returns must be provided." });
    }
  
    // Start a MongoDB session for transaction handling (to ensure atomicity)
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const updatedProducts = [];
      let totalRefundAmount = 0; // Initialize total refund amount
  
      // Loop through the returns and process them one by one
      for (let returnItem of returns) {
        const { productId, saleId, qty, reason } = returnItem;
  
        if (!qty || qty <= 0) {
          throw new Error("Quantity must be greater than zero.");
        }
  
        const product = await Product.findById(productId).session(session);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found.`);
        }
  
        // Find the sale using the saleId
        const saleIndex = product.sells.findIndex((sell) => {
          // Check if the _id exists and compare it with saleId
          return sell._id && sell._id.toString() === saleId;
        });
  
        if (saleIndex === -1) {
          throw new Error(`Sale with ID ${saleId} not found for product ${product.pname}.`);
        }
  
        const sale = product.sells[saleIndex];
  
        // Check if the total return quantity exceeds the quantity sold
        const totalReturnedQty = product.salesReturn.reduce((total, saleReturn) => {
          // Check if saleReturn.saleId exists and compare
          if (saleReturn.saleId && saleReturn.saleId.toString() === saleId) {
            total += saleReturn.qty;
          }
          return total;
        }, 0);
  
        const totalQtySold = sale.qty;
  
        // If the total returned quantity exceeds the quantity sold, return an error
        if (totalReturnedQty + qty > totalQtySold) {
          return res.status(400).json({
            message: `Cannot return more than the sold quantity for sale ${saleId} of product ${product.pname}. The sale only had ${totalQtySold} items, and you've already returned ${totalReturnedQty} items.`
          });
          
        }
  
        // Calculate the refund amount for this product
        const refundAmount = qty * product.price;
        totalRefundAmount += refundAmount; // Add to total refund amount
  
        // Create a sale return object
        const saleReturn = {
          qty,
          reason: reason || "No reason provided",
          saleId,  // Ensure saleId is correctly included
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        // Update the product's quantity and total (if the return is valid)
        product.qty += qty; // Increase stock by the returned quantity
        product.total = product.qty * product.price; // Recalculate the product's total value
  
        // Add the sale return object to the salesReturn array
        product.salesReturn.push(saleReturn);
  
        // Save the product within the session
        await product.save({ session });
  
        updatedProducts.push(product); // Keep track of all updated products
      }
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        message: "Sale returns processed successfully.",
        products: updatedProducts, // Return the updated products
        totalRefundAmount, // Include the total refund amount in the response
      });
  
    } catch (err) {
      // Abort the transaction in case of any error
      await session.abortTransaction();
      session.endSession();
  
      console.error("Error processing sale returns:", err);
      return res.status(500).json({ message: err.message || "Internal server error." });
    }
  };
  