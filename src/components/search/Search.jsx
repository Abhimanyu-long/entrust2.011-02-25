import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Importing the context

export const Search = ({ searchQuery }) => {
  const { searchEntities } = useAuth(); // Using searchEntities from AuthContext
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [randomKeys, setRandomKeys] = useState([]);

  // Function to select 5 random keys from an object
  const getRandomKeys = (obj) => {
    const keys = Object.keys(obj);
    const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 5);
    return randomKeys;
  };

  // Effect to trigger search when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]); // Trigger search when searchQuery changes

// Function to perform the search using the imported searchEntities function
const handleSearch = async () => {
  try {
    // console.log("priya232 =>", searchQuery);

    const data = await searchEntities(searchQuery); // Call searchEntities

    // Initialize an empty array to store all matching results
    let allResults = [];

    // Check and search in 'clients' array
    if (data.clients && data.clients.length > 0) {
      const clientResults = data.clients.filter(client =>
        client.client_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      allResults = [...allResults, ...clientResults]; // Add to results
    }

    // Check and search in 'cases' array
    if (data.cases && data.cases.length > 0) {
      const caseResults = data.cases.filter(caseItem =>
        caseItem.case_name.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust field based on your case structure
      );
      allResults = [...allResults, ...caseResults]; // Add to results
    }

    // Check and search in 'projects' array
    if (data.projects && data.projects.length > 0) {
      const projectResults = data.projects.filter(project =>
        project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust field based on your project structure
      );
      allResults = [...allResults, ...projectResults]; // Add to results
    }

    // Add other arrays like 'users' if necessary with similar logic
    // Example for 'users'
    if (data.users && data.users.length > 0) {
      const userResults = data.users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) // Use correct key 'username'
      );
      allResults = [...allResults, ...userResults]; // Add to results
    }

    // Handle the case when no results were found
    if (allResults.length === 0) {
      setSearchResults([]); // No matching results
      setError("No results found."); // Set no results error
    } else {
      setSearchResults(allResults); // Set search results
      setError(null); // Clear any error

      // Set random 5 keys for the table from the first result
      if (allResults.length > 0) {
        setRandomKeys(getRandomKeys(allResults[0])); // Set random keys only once after getting results
      }
    }
  } catch (err) {
    setError(err.message || "Something went wrong. Please try again."); // Set error if the search fails
    setSearchResults([]); // Clear search results on error
  }
};

  // console.log("searchResults", searchResults);

  return (
    <div className="search-component mx-6">
      {searchQuery ? <p>You are searching for: {searchQuery}</p> : <p>No search query yet.</p>}

      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

      {searchResults.length > 0 ? (
        <table className="table table-row-bordered align-middle gy-4 gs-9">
          <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
            <tr>
              {randomKeys.map((key, index) => (
                <th key={index} style={{ width: "auto" }}>
                  {key.replace(/_/g, " ")} {/* Display keys as column names */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="fw-semibold text-gray-600">
            {searchResults.map((result, index) => (
              <tr key={index}>
                {randomKeys.map((key, i) => (
                  <td key={i}>
                    {result[key] !== null && result[key] !== undefined ? result[key].toString() : 'NA'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && searchQuery && <p>No results found.</p>
      )}
    </div>
  );
};
