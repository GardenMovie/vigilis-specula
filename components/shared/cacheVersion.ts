const CACHE_VERSION_KEY = "cache_version"
const CACHE_VERSION = process.env.NEXT_PUBLIC_CACHE_VERSION ?? "1"
const CACHE_KEY_PREFIXES = ["hourly_cache_", "daily_cache_", "minutely_cache_", "specs_cache_"]

export function invalidateCacheIfVersionChanged() {
  try {
    const stored = localStorage.getItem(CACHE_VERSION_KEY)
    if (stored === CACHE_VERSION) return
    for (const key of Object.keys(localStorage)) {
      if (CACHE_KEY_PREFIXES.some(prefix => key.startsWith(prefix))) {
        localStorage.removeItem(key)
      }
    }
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION)
  } catch {}
}
