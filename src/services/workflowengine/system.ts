// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Engine in-memory statistics GET /workflowengine/engine/stats */
export async function getEngineStats(options?: { [key: string]: any }) {
  return request<any>("/workflowengine/engine/stats", {
    method: "GET",
    ...(options || {}),
  });
}

/** Health check GET /workflowengine/health */
export async function getHealth(options?: { [key: string]: any }) {
  return request<any>("/workflowengine/health", {
    method: "GET",
    ...(options || {}),
  });
}
