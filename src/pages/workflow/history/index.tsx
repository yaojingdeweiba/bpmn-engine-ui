import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tag, Tabs } from 'antd';
import dayjs from 'dayjs';
import {
  historyApi,
  type HistoryProcessInstance,
  type HistoryActivity,
  type HistoryTask,
} from '@/services/engine';

const stateColor: Record<string, string> = {
  completed: 'success',
  running: 'processing',
  failed: 'error',
  suspended: 'warning',
};

function HistoryProcessInstances() {
  const columns: ProColumns<HistoryProcessInstance>[] = [
    { title: 'ID', dataIndex: 'id', width: 240, copyable: true, ellipsis: true },
    { title: 'Process Key', dataIndex: 'processDefinitionKey' },
    { title: 'Business Key', dataIndex: 'businessKey', render: (v) => v || '-' },
    {
      title: 'State',
      dataIndex: 'state',
      render: (v: any) => <Tag color={stateColor[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Duration',
      dataIndex: 'durationInMillis',
      search: false,
      render: (v: any) => (v != null ? `${v}ms` : '-'),
    },
  ];
  return (
    <ProTable<HistoryProcessInstance>
      rowKey="id"
      columns={columns}
      headerTitle={false}
      search={{ labelWidth: 'auto' }}
      pagination={{ pageSize: 20 }}
      request={async (params) => {
        const data = await historyApi.processInstances({
          processDefinitionKey: params.processDefinitionKey,
          businessKey: params.businessKey,
          state: params.state,
          firstResult: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
          maxResults: params.pageSize,
        });
        const list = Array.isArray(data) ? data : [];
        return { data: list, success: true, total: list.length };
      }}
    />
  );
}

function HistoryActivities() {
  const columns: ProColumns<HistoryActivity>[] = [
    { title: 'Activity ID', dataIndex: 'activityId', ellipsis: true },
    { title: 'Name', dataIndex: 'activityName' },
    {
      title: 'Type',
      dataIndex: 'activityType',
      search: false,
      render: (v) => <Tag>{v as string}</Tag>,
    },
    { title: 'Proc Instance', dataIndex: 'processInstanceId', ellipsis: true, copyable: true },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ];
  return (
    <ProTable<HistoryActivity>
      rowKey="id"
      columns={columns}
      headerTitle={false}
      search={{ labelWidth: 'auto' }}
      pagination={{ pageSize: 20 }}
      request={async (params) => {
        const data = await historyApi.activityInstances({
          processInstanceId: params.processInstanceId,
          activityType: params.activityType,
          firstResult: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
          maxResults: params.pageSize,
        });
        const list = Array.isArray(data) ? data : [];
        return { data: list, success: true, total: list.length };
      }}
    />
  );
}

function HistoryTasks() {
  const columns: ProColumns<HistoryTask>[] = [
    { title: 'ID', dataIndex: 'id', width: 220, copyable: true, ellipsis: true },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Assignee', dataIndex: 'assignee', render: (v) => v || '-' },
    { title: 'Proc Instance', dataIndex: 'processInstanceId', ellipsis: true, copyable: true },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Duration',
      dataIndex: 'durationInMillis',
      search: false,
      render: (v: any) => (v != null ? `${v}ms` : '-'),
    },
  ];
  return (
    <ProTable<HistoryTask>
      rowKey="id"
      columns={columns}
      headerTitle={false}
      search={{ labelWidth: 'auto' }}
      pagination={{ pageSize: 20 }}
      request={async (params) => {
        const data = await historyApi.tasks({
          processInstanceId: params.processInstanceId,
          firstResult: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
          maxResults: params.pageSize,
        });
        const list = Array.isArray(data) ? data : [];
        return { data: list, success: true, total: list.length };
      }}
    />
  );
}

export default function HistoryPage() {
  return (
    <PageContainer title="History">
      <Tabs
        defaultActiveKey="instances"
        items={[
          { key: 'instances', label: 'Process Instances', children: <HistoryProcessInstances /> },
          { key: 'activities', label: 'Activity Instances', children: <HistoryActivities /> },
          { key: 'tasks', label: 'Tasks', children: <HistoryTasks /> },
        ]}
      />
    </PageContainer>
  );
}
