import { request } from "./request";

/**
 * 搜索 - 与原项目 search.js 保持一致
 */
export function searchReq(data: any) {
  return request({
    url: "/api/search?content=" + data,
    method: "get"
  });
} 