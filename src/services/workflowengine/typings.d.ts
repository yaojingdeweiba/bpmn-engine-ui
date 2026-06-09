declare namespace API {
  type getDeploymentIdParams = {
    id: string;
  };

  type getDeploymentParams = {
    name?: string;
    tenantId?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getExternalTaskIdParams = {
    id: string;
  };

  type getExternalTaskParams = {
    topicName?: string;
    processInstanceId?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getHistoryActivityInstanceParams = {
    processInstanceId?: string;
    activityId?: string;
    activityType?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getHistoryProcessInstanceIdParams = {
    id: string;
  };

  type getHistoryProcessInstanceParams = {
    processDefinitionKey?: string;
    businessKey?: string;
    state?:
      | "ACTIVE"
      | "COMPLETED"
      | "EXTERNALLY_TERMINATED"
      | "INTERNALLY_TERMINATED";
    tenantId?: string;
    startedAfter?: string;
    startedBefore?: string;
    finishedAfter?: string;
    finishedBefore?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getHistoryTaskParams = {
    processInstanceId?: string;
    assignee?: string;
    taskDefinitionKey?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getHistoryVariableInstanceParams = {
    processInstanceId?: string;
    variableName?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getJobIdParams = {
    id: string;
  };

  type getJobParams = {
    processInstanceId?: string;
    type?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getProcessDefinitionIdParams = {
    id: string;
  };

  type getProcessDefinitionIdXmlParams = {
    id: string;
  };

  type getProcessDefinitionKeyKeyParams = {
    key: string;
  };

  type getProcessDefinitionKeyKeyTenantIdTenantIdParams = {
    key: string;
    tenantId: string;
  };

  type getProcessDefinitionParams = {
    key?: string;
    tenantId?: string;
    deploymentId?: string;
    latestVersion?: boolean;
    firstResult?: number;
    maxResults?: number;
  };

  type getProcessInstanceIdActivityInstancesParams = {
    id: string;
  };

  type getProcessInstanceIdParams = {
    id: string;
  };

  type getProcessInstanceIdVariablesParams = {
    id: string;
  };

  type getProcessInstanceIdVariablesVarNameParams = {
    id: string;
    varName: string;
  };

  type getProcessInstanceParams = {
    processDefinitionId?: string;
    processDefinitionKey?: string;
    businessKey?: string;
    state?:
      | "running"
      | "suspended"
      | "completed"
      | "externally-terminated"
      | "error";
    tenantId?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type getTaskIdFormParams = {
    id: string;
  };

  type getTaskIdParams = {
    id: string;
  };

  type getTaskIdVariablesParams = {
    id: string;
  };

  type getTaskParams = {
    processInstanceId?: string;
    processDefinitionKey?: string;
    assignee?: string;
    unassigned?: boolean;
    taskDefinitionKey?: string;
    tenantId?: string;
    firstResult?: number;
    maxResults?: number;
  };

  type postDeploymentId_openAPI_deleteParams = {
    id: string;
  };

  type postExternalTaskIdBpmnErrorParams = {
    id: string;
  };

  type postExternalTaskIdCompleteParams = {
    id: string;
  };

  type postExternalTaskIdExtendLockParams = {
    id: string;
  };

  type postExternalTaskIdFailureParams = {
    id: string;
  };

  type postExternalTaskIdUnlockParams = {
    id: string;
  };

  type postJobId_openAPI_deleteParams = {
    id: string;
  };

  type postJobIdExecuteParams = {
    id: string;
  };

  type postJobIdRetriesParams = {
    id: string;
  };

  type postProcessDefinitionIdStartParams = {
    id: string;
  };

  type postProcessDefinitionIdSuspendedParams = {
    id: string;
  };

  type postProcessDefinitionKeyKeyStartParams = {
    key: string;
  };

  type postProcessInstanceId_openAPI_deleteParams = {
    deleteReason?: string;
    id: string;
  };

  type postProcessInstanceIdActivateParams = {
    id: string;
  };

  type postProcessInstanceIdSuspendParams = {
    id: string;
  };

  type postProcessInstanceIdVariablesParams = {
    id: string;
  };

  type postProcessInstanceIdVariablesVarName_openAPI_deleteParams = {
    id: string;
    varName: string;
  };

  type postProcessInstanceIdVariablesVarNameParams = {
    id: string;
    varName: string;
  };

  type postTaskIdClaimParams = {
    id: string;
  };

  type postTaskIdCompleteParams = {
    id: string;
  };

  type postTaskIdDelegateParams = {
    id: string;
  };

  type postTaskIdResolveParams = {
    id: string;
  };

  type postTaskIdUnclaimParams = {
    id: string;
  };
}
