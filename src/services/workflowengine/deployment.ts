// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** List deployments GET /deployment */
export async function getDeployment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeploymentParams,
  options?: { [key: string]: any }
) {
  return request<any>("/deployment", {
    method: "GET",
    params: {
      // maxResults has a default value: 20
      maxResults: "20",
      ...params,
    },
    ...(options || {}),
  });
}

/** Get deployment by ID GET /deployment/${param0} */
export async function getDeploymentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeploymentIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/deployment/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Delete deployment POST /deployment/${param0}/delete */
export async function postDeploymentIdOpenApiDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postDeploymentId_openAPI_deleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/deployment/${param0}/delete`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Deploy BPMN resources POST /deployment/create */
export async function postDeploymentCreate(options?: { [key: string]: any }) {
  return request<{
    id?: string;
    name?: string;
    deploymentTime?: string;
    tenantId?: any;
    deployedProcessDefinitions?: Record<string, any>;
  }>("/deployment/create", {
    method: "POST",
    ...(options || {}),
  });
}

/** Deploy BPMN resources (Camunda Modeler compatible endpoint) Camunda Modeler "Deploy Diagram to Camunda Platform" button endpoint. Configure the Modeler deployment URL to `http://localhost:3000` and click Deploy. POST /engine-rest/deployment/create */
export async function postEngineRestDeploymentCreate(options?: {
  [key: string]: any;
}) {
  return request<{
    id?: string;
    name?: string;
    deploymentTime?: string;
    tenantId?: any;
    deployedProcessDefinitions?: Record<string, any>;
  }>("/engine-rest/deployment/create", {
    method: "POST",
    ...(options || {}),
  });
}
