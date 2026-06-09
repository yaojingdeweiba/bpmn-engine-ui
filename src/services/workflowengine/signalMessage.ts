// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** Correlate a message to a waiting process instance POST /message */
export async function postMessage(
  body: {
    /** Message name as defined in BPMN */
    messageName: string;
    /** Target process instance (optional – if omitted, broadcasts) */
    processInstanceId?: string;
    /** Correlation keys to identify the target instance */
    correlationKeys?: Record<string, any>;
    /** Camunda-format variables to pass with the message */
    processVariables?: Record<string, any>;
    tenantId?: string;
  },
  options?: { [key: string]: any }
) {
  return request<any>("/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Throw a named signal to all waiting process instances POST /signal */
export async function postSignal(
  body: {
    /** Signal name as defined in BPMN */
    name: string;
    /** Camunda-format variables to pass with the signal */
    variables?: Record<string, any>;
    tenantId?: string;
  },
  options?: { [key: string]: any }
) {
  return request<any>("/signal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
