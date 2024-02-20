import { Router } from "express";
import multer from "multer";
import path from 'path';
import { deleteProduct, updateProducts, addProduct } from "../controller/admin.js";

const router = Router();

// Set up storage options for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img'); // Set the destination to 'public/img'
    },
    filename: function (req, file, cb) {
      // Use the original file name and extension
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage: storage });


router.put("/update/:id", updateProducts);
router.delete("/delete/:id",deleteProduct);
router.post("/add-product", upload.single('Image'), addProduct);


export default router;