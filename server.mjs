import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import projectRouter from "./Route/index.mjs";
const app = express();
app.use(cors());

// app.get("/jira-ALLProject", async (req, res) => {
//   try {
//     const response = await fetch(
//       " https://dcmv2.atlassian.net/rest/api/3/project",
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             "nixaamteammern@gmail.com:ATATT3xFfGF0M5Pb5tBsJXuQiwVPO-C17gBN4BgzV656jrAwvgAyFc7qucq3HCsCR0JE0s42GtEoFcoxqiNt_78yCUvOAkL_ddw5698RTBQIFITxVRQhVfAX3hyoUf-_g7QbAqWDGG9TF4QSX6p2PhsuInBEq5fHaoCtsGhqmqbsxQ8MbEOiwmU=1A666130"
//           ).toString("base64")}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching Jira data:", error);
//     res.status(500).json({ error: "Error fetching Jira data" });
//   }
// });

// app.get("/KAN-projectTasksTime/:getKANProjectTasksTime", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://dcmv2.atlassian.net/rest/api/3/search?jql=project=${10000}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             "nixaamteammern@gmail.com:ATATT3xFfGF0M5Pb5tBsJXuQiwVPO-C17gBN4BgzV656jrAwvgAyFc7qucq3HCsCR0JE0s42GtEoFcoxqiNt_78yCUvOAkL_ddw5698RTBQIFITxVRQhVfAX3hyoUf-_g7QbAqWDGG9TF4QSX6p2PhsuInBEq5fHaoCtsGhqmqbsxQ8MbEOiwmU=1A666130"
//           ).toString("base64")}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching Jira data:", error);
//     res.status(500).json({ error: "Error fetching Jira data" });
//   }
// });

//new code for all project data in single API

// app.get("/Allproject-details", cors(), async (req, res) => {
//   try {
//     const projectsResponse = await fetch(
//       "https://proprint.atlassian.net/rest/api/3/project",
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             "srzafar1@gmail.com:ATATT3xFfGF0fWRwIp39Fh5F7uxRyvbJi2Wfn8DUhb4O7hsrpULb4x3UrkDfeVPz1AIVAQhIlMJMeHrau9mTlr8QdZcJGyVXGyolkGeBLjk5E3bJKHmuPux3A1PLHoa2YERDtz5raUsZQOVvJHcqqmSXeM1vQZgHfI4gofmyg3WWBSTILt1qx0g=21CE5CDE"
//           ).toString("base64")}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     const projectsData = await projectsResponse.json();

//     const projectDetails = [];

//     for (const project of projectsData) {
//       // Fetch project details
//       const projectResponse = await fetch(
//         `https://proprint.atlassian.net/rest/api/3/search?jql=project=${project.key}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Basic ${Buffer.from(
//               "srzafar1@gmail.com:ATATT3xFfGF0fWRwIp39Fh5F7uxRyvbJi2Wfn8DUhb4O7hsrpULb4x3UrkDfeVPz1AIVAQhIlMJMeHrau9mTlr8QdZcJGyVXGyolkGeBLjk5E3bJKHmuPux3A1PLHoa2YERDtz5raUsZQOVvJHcqqmSXeM1vQZgHfI4gofmyg3WWBSTILt1qx0g=21CE5CDE"
//             ).toString("base64")}`,
//             Accept: "application/json",
//           },
//         }
//       );
//       const projectData = await projectResponse.json();
//       projectDetails.push(projectData);
//     }

//     res.json(projectDetails);
//   } catch (error) {
//     console.error("Error fetching project details:", error);
//     res.status(500).json({ error: "Error fetching project details" });
//   }
// });

app.use("/api/project-data", projectRouter);
app.use("/api/project-search", projectRouter);
app.use("/api/project-assigne", projectRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
