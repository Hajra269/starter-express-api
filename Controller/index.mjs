import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL;
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

const search = async (req, res) => {
  try {
    const { query } = req.query;
    let jqlQuery = `text ~ "${query}"`; // Use the ~ operator for 'contains' in text field

    const searchResponse = await fetch(
      `https://proprint.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(
        jqlQuery
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: authorizationHeader,
          Accept: "application/json",
        },
      }
    );

    const searchData = await searchResponse.json();
    if (searchData.issues?.length === 0) {
      const issueKeyRegex = /^[A-Z]+-\d+$/;
      if (issueKeyRegex.test(query)) {
        jqlQuery = `key = "${query}"`;
      } else {
        jqlQuery = `project = "${query}"`; // Fix the syntax for project search
      }
      const searchResponse = await fetch(
        `https://proprint.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(
          jqlQuery
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: authorizationHeader,
            Accept: "application/json",
          },
        }
      );
      const searchData = await searchResponse.json();
      return res.json(searchData);
    }
    return res.json(searchData);
  } catch (error) {
    console.error("Error searching Jira:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { func, search };
