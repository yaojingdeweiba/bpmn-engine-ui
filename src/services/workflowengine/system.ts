// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Engine in-memory statistics GET /engine/stats */
export async function getEngineStats(options?: { [key: string]: any }) {
  return request<any>("/engine/stats", {
    method: "GET",
    ...(options || {}),
  });
}

/** Health check GET /health */
export async function getHealth(options?: { [key: string]: any }) {
  return request<any>("/health", {
    method: "GET",
    ...(options || {}),
  });
}
