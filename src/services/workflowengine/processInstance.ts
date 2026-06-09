// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** List process instances GET /process-instance */
export async function getProcessInstance(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessInstanceParams,
  options?: { [key: string]: any }
) {
  return request<any>("/process-instance", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get process instance by ID GET /process-instance/${param0} */
export async function getProcessInstanceId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessInstanceIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Activate a suspended process instance POST /process-instance/${param0}/activate */
export async function postProcessInstanceIdActivate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceIdActivateParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/activate`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Get running activity instances for a process instance GET /process-instance/${param0}/activity-instances */
export async function getProcessInstanceIdActivityInstances(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessInstanceIdActivityInstancesParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/activity-instances`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Delete (terminate) a process instance POST /process-instance/${param0}/delete */
export async function postProcessInstanceIdOpenApiDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceId_openAPI_deleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/delete`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** Suspend a running process instance POST /process-instance/${param0}/suspend */
export async function postProcessInstanceIdSuspend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceIdSuspendParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/suspend`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}
