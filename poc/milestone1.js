/**
 * Milestone 1: Can we fetch a public LeetCode profile?
 * 
 * Run: node milestone1.js <username>
 */

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const GET_USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        userAvatar
      }
    }
  }
`;

async function fetchLeetCodeProfile(username) {
  const payload = {
    query: GET_USER_PROFILE_QUERY,
    variables: { username }
  };

  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    // Check if user doesn't exist (matchedUser will be null)
    if (!json.data || !json.data.matchedUser) {
      return {
        exists: false,
        error: "User not found or profile is completely private."
      };
    }

    return {
      exists: true,
      data: json.data.matchedUser
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
}

// Execution
const username = process.argv[2] || "vanshvijay"; // Default username to test

console.log(`[Milestone 1] Fetching profile for username: "${username}"...`);

fetchLeetCodeProfile(username).then((result) => {
  if (result.exists) {
    console.log("\n✅ Success! Profile fetched successfully.");
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log(`\n❌ Failed: ${result.error}`);
  }
});
