// Route/index.mjs
import fetch from "node-fetch";
import express from "express";
import { func } from "../Controller/index.mjs";
import { search } from "../Controller/index.mjs";

const router = express.Router();
router.get("/Allproject-details", func);
router.get("/Allproject-search", search);

export default router; // Export as default
