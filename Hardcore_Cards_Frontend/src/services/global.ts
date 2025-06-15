import { request } from "./request";

/**
 * 测试Token - 与原项目 global.js 保持一致
 */
export function testToken() {
  return request({
    url: "/api/test",
    method: "get"
  });
} 