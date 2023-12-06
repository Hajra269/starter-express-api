// Route/index.mjs
import fetch from "node-fetch";
import express from "express";
import {
  func,
  searchByAssignee,
  search,
  groupByFilters,
} from "../Controller/index.mjs";

const router = express.Router();
router.get("/Allproject-details", func);
router.get("/Allproject-search", search);
router.get("/searchByAssignee-search", searchByAssignee);
router.get("/groupBy-filter", groupByFilters);

export default router; // Export as default
