const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const GET_USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        aboutMe
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

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

const GET_USER_CALENDAR_QUERY = `
  query userProfileCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        submissionCalendar
      }
    }
  }
`;

class LeetCodeProvider {
  /**
   * Helper to execute GraphQL POST requests to LeetCode with retries and failovers
   */
  async _makeGraphQLRequest(query, variables, retries = 3) {
    let lastError = null;
    const agents = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    ];
    const urls = [
      "https://leetcode.com/graphql",
      "https://leetcode.cn/graphql" // China mirror failover
    ];

    for (let attempt = 0; attempt < retries; attempt++) {
      const url = urls[attempt % urls.length];
      const userAgent = agents[attempt % agents.length];
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com",
            "User-Agent": userAgent
          },
          body: JSON.stringify({ query, variables })
        });

        if (response.ok) {
          const json = await response.json();
          if (!json.errors) {
            return json.data;
          }
          lastError = new Error(json.errors[0]?.message || "GraphQL query error.");
        } else {
          lastError = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
      }
      
      // Delay before retrying
      await new Promise(r => setTimeout(r, 450));
    }
    
    console.error(`[LeetCodeProvider] All API attempts failed:`, lastError?.message);
    throw lastError || new Error("LeetCode API service is temporarily unavailable.");
  }

  /**
   * Verify if username exists and fetch basic profile info
   */
  async fetchProfile(username) {
    const data = await this._makeGraphQLRequest(GET_USER_PROFILE_QUERY, { username });
    if (!data.matchedUser) {
      throw new Error(`LeetCode account "${username}" not found or profile is completely private.`);
    }
    return data.matchedUser;
  }

  /**
   * Ownership verification: checks if the bio contains the generated token
   */
  async verifyAccountOwnership(username, verificationToken) {
    const userProfile = await this.fetchProfile(username);
    const aboutMe = userProfile.profile?.aboutMe || "";
    
    // Check if the token is present in the bio
    return aboutMe.includes(verificationToken);
  }

  /**
   * Fetch solved problems on the current date relative to the user's timezone
   */
  async fetchDailySolveStatus(username, targetTimeZone = "Asia/Kolkata", mockDate = null) {
    const data = await this._makeGraphQLRequest(RECENT_AC_SUBMISSIONS_QUERY, { username, limit: 20 });
    const submissions = data.recentAcSubmissionList || [];

    const now = mockDate ? new Date(mockDate) : new Date();
    const todayStr = this._getLocalDateString(now, targetTimeZone);

    // Track unique problems solved on this calendar day to de-duplicate
    const uniqueProblemsMap = new Map();

    for (const sub of submissions) {
      const subDate = new Date(parseInt(sub.timestamp) * 1000);
      const subDateStr = this._getLocalDateString(subDate, targetTimeZone);

      if (subDateStr === todayStr) {
        if (!uniqueProblemsMap.has(sub.titleSlug)) {
          uniqueProblemsMap.set(sub.titleSlug, {
            submissionId: sub.id,
            title: sub.title,
            timestamp: parseInt(sub.timestamp),
          });
        }
      }
    }

    const problems = [];
    for (const [slug, data] of uniqueProblemsMap.entries()) {
      problems.push({
        title: data.title,
        slug: slug,
        submissionId: data.submissionId,
        timestamp: data.timestamp,
      });
    }

    // Extract all recent submissions (with dates) to populate history
    const allSubmissions = [];
    const seenSubmissionIds = new Set();
    for (const sub of submissions) {
      const subDate = new Date(parseInt(sub.timestamp) * 1000);
      const subDateStr = this._getLocalDateString(subDate, targetTimeZone);
      if (!seenSubmissionIds.has(sub.id)) {
        seenSubmissionIds.add(sub.id);
        allSubmissions.push({
          submissionId: sub.id,
          title: sub.title,
          slug: sub.titleSlug,
          timestamp: parseInt(sub.timestamp),
          dateStr: subDateStr
        });
      }
    }

    return {
      solvedToday: problems.length > 0,
      solvedCount: problems.length,
      problems,
      allSubmissions,
    };
  }

  /**
   * Fetch the full historical user calendar from LeetCode (returns parsed JSON of Unix timestamps -> counts)
   */
  async fetchUserCalendar(username) {
    try {
      const data = await this._makeGraphQLRequest(GET_USER_CALENDAR_QUERY, { username });
      if (!data.matchedUser || !data.matchedUser.userCalendar) {
        return {};
      }
      const calendarStr = data.matchedUser.userCalendar.submissionCalendar || "{}";
      return JSON.parse(calendarStr);
    } catch (e) {
      console.error("[LeetCodeProvider] Failed to fetch or parse userCalendar:", e.message);
      return {};
    }
  }

  /**
   * Converts a date object to date string format (YYYY-MM-DD) localized to the user timezone
   */
  _getLocalDateString(date, timeZone) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date);
    } catch (e) {
      console.warn(`[LeetCodeProvider] Invalid timezone "${timeZone}". Falling back to UTC.`);
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date);
    }
  }
}

module.exports = new LeetCodeProvider();
