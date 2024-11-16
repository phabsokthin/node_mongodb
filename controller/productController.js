import { Product } from "../models/Product.js";


export const createProduct = async (req, res) => {
    const { pname, price, qty, total } = req.body;
 
    try {
        const product = new Product({ pname, price,qty,total });
        const saveProduct = await product.save();
        return res.status(201).json({ message: "Course created successfully", product: saveProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while creating the course", error: err.message });
    }
};



