import { describe, test, expect, beforeEach } from "bun:test";
import { getProxyAgent } from "../proxy.js";

describe("Proxy Layer Optimization & Cache", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  test("should reuse cached proxy agent instance for identical proxy URLs", () => {
    process.env.TG_PROXY_URL = "http://127.0.0.1:8080";
    
    const agent1 = getProxyAgent("api.telegram.org");
    const agent2 = getProxyAgent("tg");

    expect(agent1).toBeDefined();
    expect(agent2).toBeDefined();
    // Verify strict equality showing object instance reuse from cache
    expect(agent1).toBe(agent2);
  });

  test("should detect VK domain variants (vk.com, userapi.com, vk.me)", () => {
    process.env.VK_PROXY_URL = "socks5://127.0.0.1:1080";

    const vkAgent1 = getProxyAgent("api.vk.com");
    const vkAgent2 = getProxyAgent("sun9-1.userapi.com");
    const vkAgent3 = getProxyAgent("psv4.vk.me");

    expect(vkAgent1).toBeDefined();
    expect(vkAgent2).toBeDefined();
    expect(vkAgent3).toBeDefined();
    expect(vkAgent1).toBe(vkAgent2);
    expect(vkAgent2).toBe(vkAgent3);
  });

  test("should return undefined for direct connection configurations", () => {
    delete process.env.TG_PROXY_URL;
    delete process.env.VK_PROXY_URL;

    process.env.PROXY_URL = "direct";
    expect(getProxyAgent("api.telegram.org")).toBeUndefined();

    process.env.PROXY_URL = "false";
    expect(getProxyAgent("api.vk.com")).toBeUndefined();
  });
});
