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

