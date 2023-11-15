// Route/index.mjs
import fetch from "node-fetch";
import express from "express";
import { func } from "../Controller/index.mjs";

const router = express.Router();
router.get("/Allproject-details", func);

export default router; // Export as default
