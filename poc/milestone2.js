/**
 * Milestone 2: Can we detect today's accepted submissions?
 * 
 * Run: node milestone2.js <username> <timezone>
 * Example: node milestone2.js awice Asia/Kolkata
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

function getLocalDateString(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  } catch (e) {
    // Fallback to UTC if timezone is invalid
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }
}

async function verifyDailySolve(username, targetTimeZone = "Asia/Kolkata", mockDate = null) {
  const payload = {
    query: RECENT_AC_SUBMISSIONS_QUERY,
    variables: { username, limit: 20 } // Capped at 20 by LeetCode anyway
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
    const submissions = json.data?.recentAcSubmissionList || [];

    const now = mockDate ? new Date(mockDate) : new Date();
    const todayStr = getLocalDateString(now, targetTimeZone);
    
    // We want to track unique problems solved today
    const uniqueProblemsMap = new Map();

    for (const sub of submissions) {
      const subDate = new Date(parseInt(sub.timestamp) * 1000);
      const subDateStr = getLocalDateString(subDate, targetTimeZone);

      if (subDateStr === todayStr) {
        // If we haven't recorded this problem yet, or if this is a newer timestamp
        if (!uniqueProblemsMap.has(sub.titleSlug)) {
          uniqueProblemsMap.set(sub.titleSlug, {
            title: sub.title,
            timestamp: parseInt(sub.timestamp)
          });
        }
      }
    }

    const problems = [];
    const timestamps = [];
    for (const [slug, data] of uniqueProblemsMap.entries()) {
      problems.push({ title: data.title, slug: slug });
      timestamps.push(data.timestamp);
    }

    return {
      solvedToday: problems.length > 0,
      solvedCount: problems.length,
      problems: problems,
      timestamps: timestamps
    };
  } catch (error) {
    throw new Error(`Failed verification check: ${error.message}`);
  }
}

// CLI Execution
const username = process.argv[2] || "awice";
const timeZone = process.argv[3] || "Asia/Kolkata";
const mockDate = process.argv[4] || null;

console.log(`[Milestone 2] Verification Test`);
console.log(`- Username: ${username}`);
console.log(`- Timezone: ${timeZone}`);
console.log(`- Mock Date: ${mockDate ? mockDate : "None (Using current system time)"}`);
console.log(`- System Time (UTC): ${new Date().toISOString()}`);
console.log(`- System Local Date String: ${getLocalDateString(mockDate ? new Date(mockDate) : new Date(), timeZone)}\n`);

verifyDailySolve(username, timeZone, mockDate)

  .then((output) => {
    console.log("Output:");
    console.log(JSON.stringify(output, null, 2));
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
  });
