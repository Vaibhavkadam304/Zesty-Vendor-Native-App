import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reads JSON from AsyncStorage by key, then triggers fetcher() in the background.
 *
 * @param {string} key       storage key (e.g. '@store_cache')
 * @param {() => Promise} fetcher  function that does e.g. api.get('/...') returning a promise
 * @returns {object|null}     parsed cache or null if none
 */
export async function getCachedResource(key, fetcher) {
  let cached = null;

  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) cached = JSON.parse(raw);
  } catch (_) {}

  // Kick off a fresh fetch in the background
  fetcher()
    .then(resp =>
      AsyncStorage.setItem(key, JSON.stringify(resp.data))
    )
    .catch(() => {
      /* silent fail – you can retry on-mount in the screen */
    });

  return cached;
}
