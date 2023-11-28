// Route/index.mjs
import fetch from "node-fetch";
import express from "express";
import { func, searchByAssignee } from "../Controller/index.mjs";
import { search } from "../Controller/index.mjs";

const router = express.Router();
router.get("/Allproject-details", func);
router.get("/Allproject-search", search);
router.get("/searchByAssignee-search", searchByAssignee);

export default router; // Export as default
