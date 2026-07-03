class Code360Provider {
  /**
   * Fetch user profile stats
   * Throws a clean error explaining Code360/Coding Ninjas technical limitations
   */
  async fetchProfile(username) {
    throw new Error(
      "Code360 is currently unsupported due to technical limitations: The platform renders its profile pages entirely on the client side (Single Page Application) and restricts automated third-party data retrieval. Direct verification and daily syncing are not possible at this time."
    );
  }

  /**
   * Fetch solved problems on the current date relative to the user's timezone
   */
  async fetchDailySolveStatus(username, targetTimeZone = "Asia/Kolkata", mockDate = null) {
    throw new Error(
      "Code360 daily solve sync is unsupported due to client-side page rendering and public data retrieval restrictions."
    );
  }

  /**
   * Fetch user's historical submission calendar map
   */
  async fetchUserCalendar(username) {
    return {};
  }
}

module.exports = new Code360Provider();
