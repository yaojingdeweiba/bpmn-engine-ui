// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** List process definitions GET /workflowengine/process-definition */
export async function getProcessDefinition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessDefinitionParams,
  options?: { [key: string]: any }
) {
  return request<any>("/workflowengine/process-definition", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get process definition by ID GET /workflowengine/process-definition/${param0} */
export async function getProcessDefinitionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessDefinitionIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/process-definition/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Start a process instance by definition ID POST /workflowengine/process-definition/${param0}/start */
export async function postProcessDefinitionIdStart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessDefinitionIdStartParams,
  body: {
    businessKey?: string;
    variables?: Record<string, any>;
    tenantId?: string;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/process-definition/${param0}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** Suspend or activate a process definition POST /workflowengine/process-definition/${param0}/suspended */
export async function postProcessDefinitionIdSuspended(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessDefinitionIdSuspendedParams,
  body: {
    suspended: boolean;
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(
    `/workflowengine/process-definition/${param0}/suspended`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get BPMN XML for a process definition GET /workflowengine/process-definition/${param0}/xml */
export async function getProcessDefinitionIdXml(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessDefinitionIdXmlParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/process-definition/${param0}/xml`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Get latest process definition by key GET /workflowengine/process-definition/key/${param0} */
export async function getProcessDefinitionKeyKey(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessDefinitionKeyKeyParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params;
  return request<any>(`/workflowengine/process-definition/key/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Start a process instance by key (latest version) POST /workflowengine/process-definition/key/${param0}/start */
export async function postProcessDefinitionKeyKeyStart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProcessDefinitionKeyKeyStartParams,
  body: {
    businessKey?: string;
    variables?: Record<string, any>;
    tenantId?: string;
  },
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params;
  return request<any>(
    `/workflowengine/process-definition/key/${param0}/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get latest process definition by key and tenant GET /workflowengine/process-definition/key/${param0}/tenantId/${param1} */
export async function getProcessDefinitionKeyKeyTenantIdTenantId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessDefinitionKeyKeyTenantIdTenantIdParams,
  options?: { [key: string]: any }
) {
  const { key: param0, tenantId: param1, ...queryParams } = params;
  return request<any>(
    `/workflowengine/process-definition/key/${param0}/tenantId/${param1}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
