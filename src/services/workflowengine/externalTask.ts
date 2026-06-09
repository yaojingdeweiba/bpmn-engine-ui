// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** List external tasks GET /external-task */
export async function getExternalTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getExternalTaskParams,
  options?: { [key: string]: any }
) {
  return request<any>("/external-task", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get external task by ID GET /external-task/${param0} */
export async function getExternalTaskId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getExternalTaskIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Throw a BPMN error from an external task (triggers boundary error event) POST /external-task/${param0}/bpmnError */
export async function postExternalTaskIdBpmnError(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postExternalTaskIdBpmnErrorParams,
  body: {
    workerId: string;
    errorCode: string;
    errorMessage?: string;
    variables?: Record<string, any>;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}/bpmnError`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Complete an external task and resume the process POST /external-task/${param0}/complete */
export async function postExternalTaskIdComplete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postExternalTaskIdCompleteParams,
  body: {
    workerId: string;
    variables?: Record<string, any>;
    localVariables?: Record<string, any>;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Extend the lock duration on an external task POST /external-task/${param0}/extendLock */
export async function postExternalTaskIdExtendLock(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postExternalTaskIdExtendLockParams,
  body: {
    workerId: string;
    /** New total lock duration in ms */
    newDuration: number;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}/extendLock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Report a failure for an external task POST /external-task/${param0}/failure */
export async function postExternalTaskIdFailure(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postExternalTaskIdFailureParams,
  body: {
    workerId: string;
    errorMessage: string;
    errorDetails?: string;
    retries: number;
    /** ms before retry */
    retryTimeout?: number;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}/failure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Release the lock on an external task POST /external-task/${param0}/unlock */
export async function postExternalTaskIdUnlock(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postExternalTaskIdUnlockParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/external-task/${param0}/unlock`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Fetch and lock external tasks for a worker POST /external-task/fetch-and-lock */
export async function postExternalTaskFetchAndLock(
  body: {
    workerId: string;
    maxTasks: number;
    /** Lock duration in ms */
    lockDuration?: number;
    topics: { topicName: string; lockDuration: number; variables?: string[] }[];
  },
  options?: { [key: string]: any }
) {
  return request<any>("/external-task/fetch-and-lock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
