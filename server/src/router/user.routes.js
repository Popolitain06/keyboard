import { Router } from "express";
import { createAccount, signIn, check_token, getDetails } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/details/:id", getDetails);
router.get("/check_token", auth, check_token);

router.post("/signup", createAccount);
router.post("/signin", signIn);



export default router;