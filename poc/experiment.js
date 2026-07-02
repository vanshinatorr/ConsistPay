/**
 * Experimental validation script for LeetCode GraphQL behavior.
 */

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const RECENT_AC_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
      statusDisplay
    }
  }
`;

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        aboutMe
      }
    }
  }
`;

async function makeGraphQLRequest(query, variables) {
  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status} ${response.statusText}` };
    }
    const json = await response.json();
    return { ok: true, data: json.data, errors: json.errors };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function runExperiments() {
  console.log("=== STARTING EXPERIMENTAL VALIDATION ===\n");

  const testUser = "awice";
  
  // 1. Test multiple limits for recentAcSubmissionList
  console.log("1. Testing different limits for recentAcSubmissionList:");
  const limits = [1, 5, 20, 50, 100];
  for (const limit of limits) {
    const res = await makeGraphQLRequest(RECENT_AC_SUBMISSIONS_QUERY, { username: testUser, limit });
    if (res.ok && res.data && res.data.recentAcSubmissionList) {
      console.log(`   - Limit ${limit}: Returned ${res.data.recentAcSubmissionList.length} items`);
    } else {
      console.log(`   - Limit ${limit}: Failed. Error: ${JSON.stringify(res.errors || res.error)}`);
    }
  }

  // 1b. Test multiple limits for recentSubmissionList
  console.log("\n1b. Testing different limits for recentSubmissionList:");
  for (const limit of limits) {
    const res = await makeGraphQLRequest(RECENT_SUBMISSIONS_QUERY, { username: testUser, limit });
    if (res.ok && res.data && res.data.recentSubmissionList) {
      console.log(`   - Limit ${limit}: Returned ${res.data.recentSubmissionList.length} items`);
    } else {
      console.log(`   - Limit ${limit}: Failed. Error: ${JSON.stringify(res.errors || res.error)}`);
    }
  }

  // 2. Check for duplicate problems in recentSubmissionList
  console.log("\n2. Checking for duplicate submissions of the same problem in recentSubmissionList:");
  const resLarge = await makeGraphQLRequest(RECENT_SUBMISSIONS_QUERY, { username: testUser, limit: 100 });
  if (resLarge.ok && resLarge.data && resLarge.data.recentSubmissionList) {
    const list = resLarge.data.recentSubmissionList;
    const seen = {};
    const duplicates = [];
    
    for (const sub of list) {
      const key = `${sub.titleSlug}-${sub.statusDisplay}`;
      if (seen[key]) {
        duplicates.push({
          title: sub.title,
          status: sub.statusDisplay,
          t1: seen[key].timestamp,
          t2: sub.timestamp
        });
      } else {
        seen[key] = sub;
      }
    }
    
    console.log(`   - Total submissions fetched: ${list.length}`);
    console.log(`   - Unique title+status combinations: ${Object.keys(seen).length}`);
    console.log(`   - Duplicates found: ${duplicates.length}`);
    if (duplicates.length > 0) {
      console.log("     Example duplicate:", duplicates[0]);
    }
  }

  // 3. Test private/non-existent profiles
  console.log("\n3. Testing non-existent user profile:");
  const resNonExistent = await makeGraphQLRequest(RECENT_AC_SUBMISSIONS_QUERY, { username: "non_existent_user_12345_xyz", limit: 20 });
  console.log("   - Non-existent user recentAcSubmissionList:", JSON.stringify(resNonExistent.data));
}

runExperiments();

