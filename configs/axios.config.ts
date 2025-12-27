import { configure } from "axios-hooks";
import { LRUCache } from "lru-cache";
import axiosInstance from "./axios.instance";

// Optional: Create LRU cache for axios-hooks
const cache = new LRUCache({ max: 50 });

// Configure axios-hooks to use our instance and cache
configure({
  axios: axiosInstance,
  cache, // Remove this line if you don't want caching initially
  defaultOptions: {
    manual: false, // Auto-fetch by default
    useCache: false, // Disable cache by default (enable per hook as needed)
  },
});
