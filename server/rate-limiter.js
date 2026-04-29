class RateLimiter {
  constructor(limit, windowInMs) {
    this.limit = limit;
    this.windowInMs = windowInMs;
    this.requests = new Map();
  }

  check(key) {
    const now = Date.now();
    const currentEntry = this.requests.get(key);

    if (!currentEntry || currentEntry.expiresAt <= now) {
      this.requests.set(key, {
        count: 1,
        expiresAt: now + this.windowInMs
      });
      return {
        allowed: true,
        remaining: this.limit - 1
      };
    }

    if (currentEntry.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0
      };
    }

    currentEntry.count += 1;
    return {
      allowed: true,
      remaining: this.limit - currentEntry.count
    };
  }
}

module.exports = {
  RateLimiter
};
