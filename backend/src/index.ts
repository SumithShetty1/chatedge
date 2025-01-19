import express from "express";
import { config } from "dotenv";

config();

const app = express();

// Middlewares
app.use(express.json());


// Connections and Listeners
app.listen(5000, ()=> console.log("Server Open"));
