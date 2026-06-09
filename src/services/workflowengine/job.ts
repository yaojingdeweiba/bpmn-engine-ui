// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** List jobs GET /job */
export async function getJob(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobParams,
  options?: { [key: string]: any }
) {
  return request<any>("/job", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get job by ID GET /job/${param0} */
export async function getJobId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/job/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Delete a job POST /job/${param0}/delete */
export async function postJobIdOpenApiDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postJobId_openAPI_deleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/job/${param0}/delete`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Manually trigger execution of a job POST /job/${param0}/execute */
export async function postJobIdExecute(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postJobIdExecuteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/job/${param0}/execute`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Set the number of retries for a job POST /job/${param0}/retries */
export async function postJobIdRetries(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postJobIdRetriesParams,
  body: {
    retries: number;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/job/${param0}/retries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
