class MemoryCache {
  constructor(ttlInMs) {
    this.ttlInMs = ttlInMs;
    this.store = new Map();
  }

  get(key) {
    const cachedEntry = this.store.get(key);
    if (!cachedEntry) {
      return null;
    }

    if (cachedEntry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return cachedEntry.value;
  }

  set(key, value) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlInMs
    });
  }
}

module.exports = {
  MemoryCache
};
