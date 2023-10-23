import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./router/index.routes.js"; 

const PORT = process.env.PORT || 9000;

const app = express();


    app.use(express.static("public"))
    .use(cors())        
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(router)

    
app.listen(9000, () => console.log("running on http://localhost:"+PORT));