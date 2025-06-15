import { request } from "./request";
import qs from "qs";

/**
 * 获取所有看板 - 与原项目 kanban.js 保持一致
 */
export function allKanban() {
  return request({
    url: "/api/kanban",
    method: "get"
  });
}

/**
 * 更新看板 - 与原项目保持一致
 */
export function updateKanban(data: any) {
  return request({
    url: "/api/kanban",
    data,
    method: "put"
  });
}

/**
 * 添加看板 - 与原项目保持一致
 */
export function addKanban(data: any) {
  return request({
    url: "/api/kanban",
    data,
    method: "post"
  });
}

/**
 * 删除看板 - 与原项目保持一致
 */
export function deleteKanbanReq(data: any) {
  return request({
    url: "/api/kanban?kanbanId=" + data,
    method: "delete"
  });
}

/**
 * 收藏看板 - 与原项目保持一致
 */
export function collectReq(data: any) {
  return request({
    url: "/api/kanban/collect",
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: "post",
    data: qs.stringify(data)
  });
}

/**
 * 获取看板内容 - 与原项目保持一致
 */
export function kanbanContent(data: any) {
  return request({
    url: "/api/kanban/content?kanbanId=" + data,
    method: "get"
  });
}

/**
 * 删除分享 - 与原项目保持一致
 */
export function deleteShareReq(data: any) {
  return request({
    url: "/api/kanban/share",
    method: "delete",
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      kanbanId: data.kanbanId,
      userId: data.userId
    })
  });
} 