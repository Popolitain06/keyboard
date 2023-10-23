import { Router } from "express";
import { getAll, getNew, getDetails, getCategories, getCategoriesDetails } from "../controller/products.js";

const router = Router();

router.get("/all", getAll);
router.get("/new", getNew);
router.get("/categories", getCategories);


router.get("/:id", getDetails);
router.get("/categories/:id", getCategoriesDetails);





export default router;