// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Query activity instance history GET /workflowengine/history/activity-instance */
export async function getHistoryActivityInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoryActivityInstanceParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/history/activity-instance", {
    method: "GET",
    params: {
      // maxResults has a default value: 50
      maxResults: "50",
      ...params,
    },
    ...(options || {}),
  });
}

/** Query history of process instances GET /workflowengine/history/process-instance */
export async function getHistoryProcessInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoryProcessInstanceParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/history/process-instance", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get a specific process instance from history GET /workflowengine/history/process-instance/${param0} */
export async function getHistoryProcessInstanceId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoryProcessInstanceIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/history/process-instance/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Query task history GET /workflowengine/history/task */
export async function getHistoryTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoryTaskParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/history/task", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Query variable instance history GET /workflowengine/history/variable-instance */
export async function getHistoryVariableInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoryVariableInstanceParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/history/variable-instance", {
    method: "GET",
    params: {
      // maxResults has a default value: 100
      maxResults: "100",
      ...params,
    },
    ...(options || {}),
  });
}
