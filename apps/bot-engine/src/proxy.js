import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";

// Cache agent instances to reuse connections and avoid socket leaks
const agentCache = new Map();

// Map domain names to platform keys
const domainToPlatform = {
  "api.telegram.org": "tg",
  "api.vk.com": "vk",
  "lp.vk.com": "vk"
};

// Helper to determine platform based on hostname
function detectPlatform(domain) {
  if (!domain) return null;
  if (domainToPlatform[domain]) return domainToPlatform[domain];
  
  const lowerDomain = domain.toLowerCase();
  if (lowerDomain.includes("telegram") || lowerDomain.includes("telegr.am")) return "tg";
  if (lowerDomain.includes("vk.com") || lowerDomain.includes("userapi.com")) return "vk";
  
  return null;
}

// Check if a proxy URL represents a direct connection configuration
function isDirectConnection(url) {
  if (!url) return true;
  const normalized = url.trim().toLowerCase();
  return (
    normalized === "false" ||
    normalized === "none" ||
    normalized === "direct" ||
    normalized === "host" ||
    normalized === ""
  );
}

// Helper to create a proxy agent instance for target domain
function createProxyAgent(proxyUrl, targetDomain) {
  if (proxyUrl.startsWith("socks")) {
    return new SocksProxyAgent(proxyUrl);
  } else if (proxyUrl.startsWith("http")) {
    return new HttpsProxyAgent(proxyUrl);
  }
  return undefined;
}

// Generate SOCKS/HTTP agent based on platform-specific or global configurations
export function getProxyAgent(targetDomainOrPlatform) {
  if (!targetDomainOrPlatform) return undefined;

  // 1. Identify platform
  const inputLower = String(targetDomainOrPlatform).toLowerCase();
  const platform = ["tg", "vk"].includes(inputLower)
    ? inputLower
    : detectPlatform(targetDomainOrPlatform);

  // 2. Resolve proxy URL based on platform specific environment variables
  let proxyUrl = null;
  if (platform === "tg") {
    proxyUrl = process.env.TG_PROXY_URL;
  } else if (platform === "vk") {
    proxyUrl = process.env.VK_PROXY_URL;
  }

  // 3. Fallback to global proxy configuration if platform specific is not defined
  if (proxyUrl === undefined || proxyUrl === null) {
    proxyUrl = process.env.PROXY_URL;
  }

  // 4. Return undefined (direct connection) if bypass rules match
  if (isDirectConnection(proxyUrl)) {
    return undefined;
  }

  // 5. Create fresh proxy agent instance
  return createProxyAgent(proxyUrl, targetDomainOrPlatform);
}

