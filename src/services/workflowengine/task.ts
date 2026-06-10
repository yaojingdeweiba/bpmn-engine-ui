// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Query user tasks GET /workflowengine/task */
export async function getTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTaskParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/task", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get task by ID GET /workflowengine/task/${param0} */
export async function getTaskId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTaskIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Claim a task POST /workflowengine/task/${param0}/claim */
export async function postTaskIdClaim(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postTaskIdClaimParams,
  body: {
    userId: string;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Complete a user task and resume the process POST /workflowengine/task/${param0}/complete */
export async function postTaskIdComplete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postTaskIdCompleteParams,
  body: {
    /** Variables in Camunda format: { varName: { value: ..., type: "String" } } */
    variables?: Record<string, any>;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Delegate task to another user POST /workflowengine/task/${param0}/delegate */
export async function postTaskIdDelegate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postTaskIdDelegateParams,
  body: {
    userId: string;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/delegate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Get the form key for a task Returns the `formKey` that was set on the UserTask in Camunda Modeler. Use this to load the correct form in your front-end application. Typical values: `embedded:app:forms/my-form.html`, `app:forms/task.html`, `camunda-forms:deployment:form.form`. GET /workflowengine/task/${param0}/form */
export async function getTaskIdForm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTaskIdFormParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ key?: any }>(`/workflowengine/task/${param0}/form`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Resolve a delegated task (return to owner) POST /workflowengine/task/${param0}/resolve */
export async function postTaskIdResolve(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postTaskIdResolveParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/resolve`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Unclaim a task POST /workflowengine/task/${param0}/unclaim */
export async function postTaskIdUnclaim(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postTaskIdUnclaimParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/unclaim`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Get task-local variables GET /workflowengine/task/${param0}/variables */
export async function getTaskIdVariables(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTaskIdVariablesParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/task/${param0}/variables`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}
