// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Deployment = {
  id: string;
  name: string;
  deploymentTime: string;
  tenantId: string | null;
};

export type ProcessDefinition = {
  id: string;
  key: string;
  name: string;
  version: number;
  deploymentId: string;
  suspended: boolean;
  tenantId: string | null;
};

export type ProcessInstance = {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  businessKey: string | null;
  state: 'running' | 'completed' | 'suspended' | 'failed';
  startTime: string;
  endTime: string | null;
};

export type Task = {
  id: string;
  name: string;
  taskDefinitionKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  assignee: string | null;
  formKey: string | null;
  createTime: string;
  variables?: Record<string, unknown>;
};

export type HistoryProcessInstance = ProcessInstance & { durationInMillis: number | null };
export type HistoryActivity = {
  id: string;
  activityId: string;
  activityName: string;
  activityType: string;
  processInstanceId: string;
  startTime: string;
  endTime: string | null;
  durationInMillis: number | null;
};
export type HistoryTask = Task & { endTime: string | null; durationInMillis: number | null };

// ── Deployment ────────────────────────────────────────────────────────────────

export const deploymentApi = {
  list: (params?: { name?: string; firstResult?: number; maxResults?: number }) =>
    request<Deployment[]>('/workflow/api/deployment', { method: 'GET', params }),

  get: (id: string) =>
    request<Deployment>(`/workflow/api/deployment/${id}`, { method: 'GET' }),

  create: (formData: FormData) =>
    request<Deployment & { deployedProcessDefinitions: Record<string, ProcessDefinition> }>(
      '/workflow/api/deployment/create',
      { method: 'POST', data: formData, requestType: 'form' },
    ),

  delete: (id: string) =>
    request(`/workflow/api/deployment/${id}/delete`, { method: 'POST' }),
};

// ── Process Definition ────────────────────────────────────────────────────────

export const processDefinitionApi = {
  list: (params?: {
    key?: string;
    name?: string;
    deploymentId?: string;
    latestVersion?: boolean;
    firstResult?: number;
    maxResults?: number;
  }) => request<ProcessDefinition[]>('/workflow/api/process-definition', { method: 'GET', params }),

  get: (id: string) =>
    request<ProcessDefinition>(`/workflow/api/process-definition/${id}`, { method: 'GET' }),

  getXml: (id: string) =>
    request<{ bpmn20Xml: string }>(`/workflow/api/process-definition/${id}/xml`, { method: 'GET' }),

  startById: (id: string, body?: { variables?: Record<string, unknown>; businessKey?: string }) =>
    request<ProcessInstance>(`/workflow/api/process-definition/${id}/start`, {
      method: 'POST',
      data: body,
    }),

  startByKey: (key: string, body?: { variables?: Record<string, unknown>; businessKey?: string }) =>
    request<ProcessInstance>(`/workflow/api/process-definition/key/${key}/start`, {
      method: 'POST',
      data: body,
    }),

  setSuspended: (id: string, suspended: boolean) =>
    request(`/workflow/api/process-definition/${id}/suspended`, {
      method: 'POST',
      data: { suspended },
    }),

  statistics: () =>
    request<
      Array<{
        definition: ProcessDefinition;
        instances: number;
        failedJobs: number;
        incidents: Array<{ incidentType: string; incidentCount: number }>;
      }>
    >('/workflow/api/process-definition/statistics', {
      method: 'GET',
      params: { groupBy: 'definition' },
    }),
};

// ── Process Instance ──────────────────────────────────────────────────────────

export const processInstanceApi = {
  list: (params?: {
    processDefinitionKey?: string;
    businessKey?: string;
    state?: string;
    firstResult?: number;
    maxResults?: number;
  }) => request<ProcessInstance[]>('/workflow/api/process-instance', { method: 'GET', params }),

  get: (id: string) =>
    request<ProcessInstance>(`/workflow/api/process-instance/${id}`, { method: 'GET' }),

  delete: (id: string, deleteReason?: string) =>
    request(`/workflow/api/process-instance/${id}/delete`, {
      method: 'POST',
      params: { deleteReason },
    }),

  suspend: (id: string) =>
    request(`/workflow/api/process-instance/${id}/suspend`, { method: 'POST' }),

  activate: (id: string) =>
    request(`/workflow/api/process-instance/${id}/activate`, { method: 'POST' }),

  activityInstances: (id: string) =>
    request(`/workflow/api/process-instance/${id}/activity-instances`, { method: 'GET' }),

  getVariables: (id: string) =>
    request<Record<string, { value: unknown; type: string }>>(
      `/workflow/api/process-instance/${id}/variables`,
      { method: 'GET' },
    ),

  setVariable: (id: string, varName: string, body: { value: unknown; type?: string }) =>
    request(`/workflow/api/process-instance/${id}/variables/${varName}`, {
      method: 'POST',
      data: body,
    }),
};

// ── Task ──────────────────────────────────────────────────────────────────────

export const taskApi = {
  list: (params?: {
    processInstanceId?: string;
    processDefinitionKey?: string;
    assignee?: string;
    unassigned?: boolean;
    firstResult?: number;
    maxResults?: number;
  }) => request<Task[]>('/workflow/api/task', { method: 'GET', params }),

  get: (id: string) => request<Task>(`/workflow/api/task/${id}`, { method: 'GET' }),

  getForm: (id: string) =>
    request<{ key: string | null }>(`/workflow/api/task/${id}/form`, { method: 'GET' }),

  getVariables: (id: string) =>
    request<Record<string, { value: unknown; type: string }>>(
      `/workflow/api/task/${id}/variables`,
      { method: 'GET' },
    ),

  claim: (id: string, userId: string) =>
    request(`/workflow/api/task/${id}/claim`, { method: 'POST', data: { userId } }),

  unclaim: (id: string) => request(`/workflow/api/task/${id}/unclaim`, { method: 'POST' }),

  complete: (id: string, variables?: Record<string, unknown>) =>
    request(`/workflow/api/task/${id}/complete`, { method: 'POST', data: { variables } }),

  delegate: (id: string, userId: string) =>
    request(`/workflow/api/task/${id}/delegate`, { method: 'POST', data: { userId } }),
};

// ── History ───────────────────────────────────────────────────────────────────

export const historyApi = {
  processInstances: (params?: {
    processDefinitionKey?: string;
    businessKey?: string;
    state?: string;
    firstResult?: number;
    maxResults?: number;
  }) =>
    request<HistoryProcessInstance[]>('/workflow/api/history/process-instance', {
      method: 'GET',
      params,
    }),

  activityInstances: (params?: {
    processInstanceId?: string;
    activityType?: string;
    firstResult?: number;
    maxResults?: number;
  }) =>
    request<HistoryActivity[]>('/workflow/api/history/activity-instance', {
      method: 'GET',
      params,
    }),

  tasks: (params?: { processInstanceId?: string; firstResult?: number; maxResults?: number }) =>
    request<HistoryTask[]>('/workflow/api/history/task', { method: 'GET', params }),
};

// ── System ────────────────────────────────────────────────────────────────────

export const systemApi = {
  health: () =>
    request<{ status: string; timestamp: string }>('/workflow/api/health', { method: 'GET' }),
  stats: () =>
    request<Record<string, unknown>>('/workflow/api/engine/stats', { method: 'GET' }),
};
