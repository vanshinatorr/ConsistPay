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
   * Helper to execute GraphQL POST requests to LeetCode
   */
  async _makeGraphQLRequest(query, variables) {
    try {
      const response = await fetch(LEETCODE_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://leetcode.com",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0]?.message || "GraphQL query error.");
      }

      return json.data;
    } catch (error) {
      console.error(`[LeetCodeProvider] API request failed:`, error.message);
      throw error;
    }
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
