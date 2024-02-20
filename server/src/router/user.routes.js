import { Router } from "express";
import { createAccount, signIn, check_token, getDetails, updateDetails } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/details", getDetails);
router.get("/check_token", auth, check_token);

router.put("/update", updateDetails);

router.post("/signup", createAccount);
router.post("/signin", signIn);



export default router;