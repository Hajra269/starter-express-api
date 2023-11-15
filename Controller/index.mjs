import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const email = "srzafar1@gmail.com";
const apiToken = process.env.Token;

const authorizationHeader = `Basic ${Buffer.from(
  `${email}:${apiToken}`
).toString("base64")}`;

const func = async (req, res) => {
  try {
    // const agent = new https.Agent({
    //   rejectUnauthorized: false,
    // });

    const projectsResponse = await fetch(
      "https://proprint.atlassian.net/rest/api/3/project",
      {
        method: "GET",
        headers: {
          Authorization: authorizationHeader,
          Accept: "application/json",
        },
        // agent: agent,
      }
    );

    const projectsData = await projectsResponse.json();

    const projectDetails = [];

    for (const project of projectsData) {
      const projectResponse = await fetch(
        `https://proprint.atlassian.net/rest/api/3/search?jql=project=${project.key}`,
        {
          method: "GET",
          headers: {
            Authorization: authorizationHeader,
            Accept: "application/json",
          },
          //agent: agent,
        }
      );
      const projectData = await projectResponse.json();
      projectDetails.push(projectData);
    }

    res.json(projectDetails);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Error fetching project details" });
  }
};

export { func };
