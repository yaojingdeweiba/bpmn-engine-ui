// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Get all variables of a process instance GET /process-instance/${param0}/variables */
export async function getProcessInstanceIdVariables(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessInstanceIdVariablesParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/variables`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Batch-modify variables on a process instance POST /process-instance/${param0}/variables */
export async function postProcessInstanceIdVariables(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceIdVariablesParams,
  body: {
    /** Camunda-format variables to set/update */
    modifications?: Record<string, any>;
    /** Variable names to delete */
    deletions?: string[];
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/variables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Get a single variable of a process instance GET /process-instance/${param0}/variables/${param1} */
export async function getProcessInstanceIdVariablesVarName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessInstanceIdVariablesVarNameParams,
  options?: { [key: string]: any }
) {
  const { id: param0, varName: param1, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/variables/${param1}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Set a single variable on a process instance POST /process-instance/${param0}/variables/${param1} */
export async function postProcessInstanceIdVariablesVarName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceIdVariablesVarNameParams,
  body: {
    value: any;
    type?: string;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, varName: param1, ...queryParams } = params;
  return request<any>(`/process-instance/${param0}/variables/${param1}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Delete a variable from a process instance POST /process-instance/${param0}/variables/${param1}/delete */
export async function postProcessInstanceIdVariablesVarNameOpenApiDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessInstanceIdVariablesVarName_openAPI_deleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, varName: param1, ...queryParams } = params;
  return request<any>(
    `/process-instance/${param0}/variables/${param1}/delete`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
