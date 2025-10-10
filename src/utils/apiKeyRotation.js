// Array di tutte le API keys RAWG
const RAWG_API_KEYS = [
  import.meta.env.VITE_RAW_G_KEY,
  import.meta.env.VITE_RAW_G_KEY1,
  import.meta.env.VITE_RAW_G_KEY2,
  import.meta.env.VITE_RAW_G_KEY3,
  import.meta.env.VITE_RAW_G_KEY4,
  import.meta.env.VITE_RAW_G_KEY5,
].filter(Boolean);

// Array di tutte le API keys YouTube 
const YOUTUBE_API_KEYS = [
  import.meta.env.VITE_YOUTUBE_KEY,
  import.meta.env.VITE_YOUTUBE_KEY1,
  import.meta.env.VITE_YOUTUBE_KEY2,
  import.meta.env.VITE_YOUTUBE_KEY3,
].filter(Boolean);

let currentRawgKeyIndex = 0;
let currentYoutubeKeyIndex = 0;

// ========== RAWG API KEYS ==========
export function getCurrentRawgApiKey() {
  return RAWG_API_KEYS[currentRawgKeyIndex];
}

export function rotateRawgApiKey() {
  currentRawgKeyIndex = (currentRawgKeyIndex + 1) % RAWG_API_KEYS.length;
  return RAWG_API_KEYS[currentRawgKeyIndex];
}

export function resetRawgApiKeyRotation() {
  currentRawgKeyIndex = 0;
  
}

export function getTotalRawgKeys() {
  return RAWG_API_KEYS.length;
}

// ========== YOUTUBE API KEYS ==========
export function getCurrentYoutubeApiKey() {
  return YOUTUBE_API_KEYS[currentYoutubeKeyIndex];
}

export function rotateYoutubeApiKey() {
  currentYoutubeKeyIndex = (currentYoutubeKeyIndex + 1) % YOUTUBE_API_KEYS.length;
  return YOUTUBE_API_KEYS[currentYoutubeKeyIndex];
}

export function resetYoutubeApiKeyRotation() {
  currentYoutubeKeyIndex = 0;
 
}

export function getTotalYoutubeKeys() {
  return YOUTUBE_API_KEYS.length;
}