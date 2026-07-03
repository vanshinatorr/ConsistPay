const GFG_PROFILE_URL = "https://www.geeksforgeeks.org/profile/";

class GFGProvider {
  /**
   * Fetch GFG public profile page and parse details
   */
  async _fetchHTML(username) {
    const url = `${GFG_PROFILE_URL}${username}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        }
      });
      if (response.status === 403 || response.status === 503) {
        throw new Error(`Profile access blocked by GeeksforGeeks Cloudflare protection (HTTP ${response.status}). Automated scraping is restricted.`);
      }
      if (!response.ok) {
        throw new Error(`GeeksforGeeks profile page returned HTTP status ${response.status}.`);
      }
      return await response.text();
    } catch (error) {
      console.warn(`[GFGProvider] Fetch failed for ${username}:`, error.message);
      throw new Error(`Unable to fetch GeeksforGeeks profile for "${username}". Details: ${error.message}`);
    }
  }

  /**
   * Fetch user profile stats
   */
  async fetchProfile(username) {
    const html = await this._fetchHTML(username);
    
    // Extract total solved problems count from Next.js hydration payload
    const solvedMatch = html.match(/\\"total_problems_solved\\":\s*(\d+)/) || html.match(/"total_problems_solved":\s*(\d+)/);
    if (!solvedMatch) {
      throw new Error("Could not parse 'total_problems_solved' count from your GeeksforGeeks profile page. The page structure might have changed.");
    }
    const solvedCount = parseInt(solvedMatch[1]);

    // Extract bio / description from Next.js hydration payload
    const bioMatch = html.match(/\\"bio\\":\s*\\"([^\\"]*)\\"/) || html.match(/"bio":\s*"([^"]*)"/);
    const aboutMe = bioMatch ? bioMatch[1] : "";

    return {
      username,
      profile: {
        realName: username,
        aboutMe
      },
      submitStatsGlobal: {
        acSubmissionNum: [
          { difficulty: "All", count: solvedCount }
        ]
      }
    };
  }

  /**
   * Fetch solved problems on the current date relative to the user's timezone.
   * Compares current live solved count against previously recorded solved count.
   */
  async fetchDailySolveStatus(username, targetTimeZone = "Asia/Kolkata", mockDate = null) {
    const profile = await this.fetchProfile(username);
    const newSolvedCount = profile.submitStatsGlobal.acSubmissionNum[0].count;

    // Retrieve old solved count to determine if they solved any new problems
    const PlatformLinkage = require("../models/PlatformLinkage");
    const linkage = await PlatformLinkage.findOne({ username, platform: "GeeksforGeeks", isVerified: true });
    const oldSolvedCount = linkage ? linkage.totalSolved : 0;

    const now = mockDate ? new Date(mockDate) : new Date();
    const todayStr = this._getLocalDateString(now, targetTimeZone);

    if (newSolvedCount > oldSolvedCount) {
      const diff = newSolvedCount - oldSolvedCount;
      const problems = [
        {
          title: "GeeksforGeeks Practice Solve",
          slug: "gfg-practice-solve",
          submissionId: `gfg-solve-${todayStr}-${newSolvedCount}`,
          timestamp: Math.floor(now.getTime() / 1000)
        }
      ];

      const allSubmissions = [
        {
          submissionId: `gfg-solve-${todayStr}-${newSolvedCount}`,
          title: "GeeksforGeeks Practice Solve",
          slug: "gfg-practice-solve",
          timestamp: Math.floor(now.getTime() / 1000),
          dateStr: todayStr
        }
      ];

      return {
        solvedToday: true,
        solvedCount: diff,
        problems,
        allSubmissions
      };
    }

    return {
      solvedToday: false,
      solvedCount: 0,
      problems: [],
      allSubmissions: []
    };
  }

  /**
   * Fetch user's historical submission calendar map
   */
  async fetchUserCalendar(username) {
    // Return empty calendar since GFG does not publish submission calendars publicly
    return {};
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
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date);
    }
  }
}

module.exports = new GFGProvider();
