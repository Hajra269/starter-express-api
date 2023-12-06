import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL;
const apiToken = process.env.Token;

const authorizationHeader = `Basic ${Buffer.from(
  `${email}:${apiToken}`
).toString("base64")}`;

const fetchOptions = {
  method: "GET",
  headers: {
    Authorization: authorizationHeader,
    Accept: "application/json",
  },
};

const func = async (req, res) => {
  try {
    const projectsResponse = await fetch(
      "https://proprint.atlassian.net/rest/api/3/project",
      fetchOptions
    );
    const projectsData = await projectsResponse.json();

    const requests = projectsData.map(async (project) => {
      const projectResponsePromise = fetch(
        `https://proprint.atlassian.net/rest/api/3/search?jql=project=${project.key}`,
        fetchOptions
      ).then((response) => response.json());

      const assignableUsersResponsePromise = fetch(
        `https://proprint.atlassian.net/rest/api/2/user/assignable/search?project=${project.key}`,
        fetchOptions
      ).then((response) => response.json());

      const [projectDetails, assignableUsers] = await Promise.all([
        projectResponsePromise,
        assignableUsersResponsePromise,
      ]);

      return { projectDetails, assignableUsers };
      // return { projectDetails };
    });

    const results = await Promise.all(requests);

    res.json({
      projectDetails: results.map((result) => result.projectDetails),
      allAsignee: results.map((result) => result.assignableUsers),
    });
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
const searchByAssignee = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query, "query");

    // Format the query parameter to be a valid JQL query for assignee
    const jqlQuery = `assignee = "${query}"`;

    const searchResponse = await fetch(
      `https://proprint.atlassian.net/rest/api/2/search?jql=${encodeURIComponent(
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
  } catch (error) {
    console.error("Error searching Jira:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const groupByFilters = async (req, res) => {
  try {
    const { query } = req.query;
    const jqlQuery = `issuetype = "${query}"`;
    const searchResponse = await fetch(
      `https://proprint.atlassian.net/rest/api/2/search?jql=${encodeURIComponent(
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

    const FilteredData = await searchResponse.json();

    return res.json(FilteredData);
  } catch (error) {
    console.error("Error searching Jira:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const groupByFilters = async (req, res) => {
//   try {
//     const { query } = req.query;
//     let startAt = 0;
//     const maxResults = 50; // Set your desired maxResults value

//     let allFilteredData = [];

//     while (true) {
//       const jqlQuery = `issuetype = "${query}"`;
//       const searchResponse = await fetch(
//         `https://proprint.atlassian.net/rest/api/2/search?jql=${encodeURIComponent(
//           jqlQuery
//         )}&startAt=${startAt}&maxResults=${maxResults}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: authorizationHeader,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!searchResponse.ok) {
//         const errorText = await searchResponse.text();
//         console.error(
//           "Error searching Jira:",
//           searchResponse.status,
//           errorText
//         );
//         return res.status(searchResponse.status).json({ error: errorText });
//       }

//       const filteredData = await searchResponse.json();

//       if (filteredData.issues.length === 0) {
//         // No more issues, break the loop
//         break;
//       }

//       // Concatenate the current page of issues to the result array
//       allFilteredData = allFilteredData.concat(filteredData.issues);

//       // Update the startAt for the next page
//       startAt += maxResults;
//     }

//     return res.json(allFilteredData);
//   } catch (error) {
//     console.error("Error searching Jira:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

export { func, search, searchByAssignee, groupByFilters };
