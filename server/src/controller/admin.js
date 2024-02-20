import Query from "../model/Query.js";
import fs from 'fs';
import path from 'path';

const deleteRelatedModels = async (productId) => {
    const query = "DELETE FROM models WHERE ProductID = ?";
    await Query.findByValue(query, productId);
}

const deleteProduct = async (req, res, next) => {
    try {
        await deleteRelatedModels(req.params.id);
        
        const query = "DELETE FROM products WHERE ProductID = ?";
        const [datas] = await Query.findByValue(query, req.params.id);

        res.status(200).json({ datas });
    } catch (error) {
        next(error);
    }
}

const updateProducts = async (req, res, next) => {
    try {
        const datasToUpdateProducts = {};
        const datasToUpdateModels = {};

        if (req.body.ProductName && req.body.ProductName.trim() !== '') {
            datasToUpdateProducts.ProductName = req.body.ProductName;
        }

        if (req.body.ModelName && req.body.ModelName.trim() !== '') {
            datasToUpdateModels.ModelName = req.body.ModelName;
        }

        if (req.body.Price && req.body.Price.trim() !== '') {
            datasToUpdateModels.Price = req.body.Price;
        }
        if (Object.keys(datasToUpdateProducts).length !== 0) {
            let queryProducts = "UPDATE products SET ";
            let valuesProducts = [];
            for (let field in datasToUpdateProducts) {
                queryProducts += `${field} = ?, `;
                valuesProducts.push(datasToUpdateProducts[field]);
            }
            queryProducts = queryProducts.slice(0, -2); // Remove the last comma and space
            queryProducts += " WHERE ProductID = ?";
            valuesProducts.push(req.params.id);
            const [datasProducts] = await Query.findByValue(queryProducts, valuesProducts);
        }

        if (Object.keys(datasToUpdateModels).length !== 0) {
            let queryModels = "UPDATE models SET ";
            let valuesModels = [];
            for (let field in datasToUpdateModels) {
                queryModels += `${field} = ?, `;
                valuesModels.push(datasToUpdateModels[field]);
            }
            queryModels = queryModels.slice(0, -2); // Remove the last comma and space
            queryModels += " WHERE ProductID = ?";
            valuesModels.push(req.params.id);

            const [datasModels] = await Query.findByValue(queryModels, valuesModels);
        }

        res.status(200).json({ msg: "Les détails ont été mis à jour" });
    } catch (error) {
        next(error);
    }
}


const addProduct = async (req, res, next) => {
    try {
        // Extract text fields from the form
        const { ProductName, Description, CategoryID, ModelRef, ModelName, Price, Stock } = req.body;
        // The file information is stored in req.file by multer
        const image = req.file;

        // Insert product into the 'products' table
        const productQuery = "INSERT INTO products (ProductName, Description, CategoryID) VALUES (?, ?, ?)";
        const productValues = [ProductName, Description, CategoryID];
        const productResult = await Query.write(productQuery, productValues);
        const productId = productResult[0].insertId;

        // Use the file path provided by multer, and remove the 'public/img/' part for the database
        const imagePath = image ? image.filename : ''; // Use just the filename

        // Insert model into the 'models' table
        const modelQuery = "INSERT INTO models (ProductID, ModelRef, ModelName, Image, Price, Stock) VALUES (?, ?, ?, ?, ?, ?)";
        const modelValues = [productId, ModelRef, ModelName, imagePath, Price, Stock];
        await Query.write(modelQuery, modelValues);

        res.status(201).json({ msg: "Product added successfully", productId: productId });
    } catch (error) {
        // If there's an error, respond with a JSON error message
        res.status(500).json({ error: error.message });
    }
}




 


export { deleteRelatedModels, deleteProduct, updateProducts, addProduct };