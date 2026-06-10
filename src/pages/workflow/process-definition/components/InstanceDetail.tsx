import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Badge,
  Button,
  message,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import BpmnViewer, { type ActiveActivity } from '@/components/BpmnViewer';
import type {
  ProcessDefinition,
  ProcessInstance,
  Task,
} from '@/services/engine';
import { getProcessDefinitionIdXml } from '@/services/workflowengine/processDefinition';
import { getProcessInstanceIdActivityInstances } from '@/services/workflowengine/processInstance';
import { getTask } from '@/services/workflowengine/task';
import { getProcessInstanceIdVariables } from '@/services/workflowengine/variables';

const { Text } = Typography;

function collectActivityIds(node: any): ActiveActivity[] {
  if (!node) return [];
  const acc: Record<string, number> = {};

  function walk(n: any) {
    const children: any[] = n.childActivityInstances ?? [];
    if (
      children.length === 0 &&
      n.activityId &&
      n.activityType !== 'processDefinition'
    ) {
      acc[n.activityId] = (acc[n.activityId] ?? 0) + 1;
    }
    children.forEach(walk);
  }
  walk(node);
  return Object.entries(acc).map(([activityId, count]) => ({
    activityId,
    count,
  }));
}

type Variable = { name: string; type: string; value: unknown; scope: string };

type Props = {
  instance: ProcessInstance;
  def: ProcessDefinition;
  onBack: () => void;
};

export default function InstanceDetail({ instance, def, onBack }: Props) {
  const [xml, setXml] = useState<string | null>(null);
  const [xmlLoading, setXmlLoading] = useState(true);
  const [activeActivities, setActiveActivities] = useState<ActiveActivity[]>(
    [],
  );
  const [variables, setVariables] = useState<Variable[]>([]);
  const [variablesLoading, setVariablesLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('variables');

  useEffect(() => {
    setXmlLoading(true);
    getProcessDefinitionIdXml({ id: def.id })
      .then((r) => setXml(r ?? ''))
      .catch(() => setXml(''))
      .finally(() => setXmlLoading(false));
  }, [def.id]);

  useEffect(() => {
    if (instance.state !== 'running' && instance.state !== 'suspended') return;
    getProcessInstanceIdActivityInstances({ id: instance.id })
      .then((tree: any) => setActiveActivities(collectActivityIds(tree)))
      .catch(() => setActiveActivities([]));
  }, [instance.id, instance.state]);

  useEffect(() => {
    if (activeTab !== 'variables') return;
    setVariablesLoading(true);
    getProcessInstanceIdVariables({ id: instance.id })
      .then((data: Record<string, { value: unknown; type: string }>) => {
        setVariables(
          Object.entries(data ?? {}).map(([name, v]) => ({
            name,
            type: v.type ?? 'String',
            value: v.value,
            scope: def.name || def.key,
          })),
        );
      })
      .catch(() => setVariables([]))
      .finally(() => setVariablesLoading(false));
  }, [activeTab, instance.id]);

  useEffect(() => {
    if (activeTab !== 'tasks') return;
    setTasksLoading(true);
    getTask({ processInstanceId: instance.id, maxResults: 100 })
      .then((d) => setTasks(Array.isArray(d) ? d : []))
      .catch(() => setTasks([]))
      .finally(() => setTasksLoading(false));
  }, [activeTab, instance.id]);

  const shortId = (id: string) => `${id.slice(0, 8)}…`;

  const metaRows: { label: string; content: React.ReactNode }[] = [
    {
      label: 'Instance ID',
      content: (
        <Text copyable style={{ fontSize: 13 }}>
          {instance.id.slice(0, 24)}…
        </Text>
      ),
    },
    {
      label: 'Business Key',
      content: (
        <Text style={{ fontSize: 14 }}>
          {instance.businessKey || <Text type="secondary">null</Text>}
        </Text>
      ),
    },
    {
      label: 'State',
      content: (
        <Badge
          status={
            {
              running: 'processing',
              completed: 'success',
              suspended: 'warning',
              failed: 'error',
            }[instance.state] as any
          }
          text={<Text style={{ fontSize: 14 }}>{instance.state}</Text>}
        />
      ),
    },
    {
      label: 'Start Time',
      content: (
        <Text style={{ fontSize: 14 }}>
          {instance.startTime
            ? dayjs(instance.startTime).format('YYYY-MM-DD HH:mm:ss')
            : '—'}
        </Text>
      ),
    },
    ...(instance.endTime
      ? [
          {
            label: 'End Time',
            content: (
              <Text style={{ fontSize: 14 }}>
                {dayjs(instance.endTime).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            ),
          },
        ]
      : []),
    {
      label: 'Definition Version',
      content: <Text style={{ fontSize: 14 }}>v{def.version}</Text>,
    },
    {
      label: 'Definition ID',
      content: (
        <Text copyable style={{ fontSize: 13 }}>
          {def.id.slice(0, 24)}…
        </Text>
      ),
    },
    {
      label: 'Definition Key',
      content: <Text style={{ fontSize: 14 }}>{def.key}</Text>,
    },
    {
      label: 'Tenant ID',
      content: def.tenantId ? (
        <Tag color="geekblue" style={{ fontSize: 13 }}>
          {def.tenantId}
        </Tag>
      ) : (
        <Text type="secondary">null</Text>
      ),
    },
    {
      label: 'Deployment ID',
      content: (
        <Text copyable style={{ fontSize: 13 }}>
          {def.deploymentId?.slice(0, 24)}…
        </Text>
      ),
    },
  ];

  return (
    <ProCard split="vertical">
      {/* Left sidebar */}
      <ProCard colSpan="20%" style={{ minHeight: 600 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={0}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            size="small"
            onClick={onBack}
            style={{ paddingLeft: 0, color: '#1677ff', marginBottom: 8 }}
          >
            {def.name || def.key}
          </Button>
          <Text
            type="secondary"
            style={{ fontSize: 12, wordBreak: 'break-all' }}
          >
            {def.name || def.key} » {shortId(instance.id)}
          </Text>

          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: 16 }}
            size={12}
          >
            {metaRows.map(({ label, content }) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>
                  {label}:
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    wordBreak: 'break-all',
                  }}
                >
                  {content}
                </div>
              </div>
            ))}
          </Space>
        </Space>
      </ProCard>

      {/* Main content */}
      <ProCard direction="column">
        <ProCard
          title="Process Diagram"
          style={{ marginBottom: 12, border: '1px solid #f0f0f0' }}
          extra={
            activeActivities.length > 0 ? (
              <Tag color="blue" style={{ fontSize: 11 }}>
                Activity Instance Statistics: on
              </Tag>
            ) : null
          }
        >
          {xmlLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 320,
              }}
            >
              <Spin />
            </div>
          ) : xml ? (
            <BpmnViewer
              xml={xml}
              height={320}
              activeActivities={activeActivities}
            />
          ) : (
            <div
              style={{
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text type="secondary">No diagram available</Text>
            </div>
          )}
        </ProCard>

        <ProCard style={{ border: '1px solid #f0f0f0' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="small"
            items={[
              {
                key: 'variables',
                label: 'Variables',
                children: (
                  <Table<Variable>
                    rowKey="name"
                    size="small"
                    loading={variablesLoading}
                    dataSource={variables}
                    pagination={false}
                    columns={[
                      {
                        title: 'Name',
                        dataIndex: 'name',
                        sorter: (a, b) => a.name.localeCompare(b.name),
                      },
                      { title: 'Type', dataIndex: 'type', width: 100 },
                      {
                        title: 'Value',
                        dataIndex: 'value',
                        render: (v) => (
                          <Text
                            style={{ fontSize: 12, maxWidth: 300 }}
                            ellipsis={{ tooltip: String(v) }}
                          >
                            {v == null ? (
                              <Text type="secondary">null</Text>
                            ) : (
                              String(v)
                            )}
                          </Text>
                        ),
                      },
                      {
                        title: 'Scope',
                        dataIndex: 'scope',
                        render: (v) => (
                          <Typography.Link style={{ fontSize: 12 }}>
                            {v}
                          </Typography.Link>
                        ),
                      },
                    ]}
                    locale={{ emptyText: 'No variables' }}
                  />
                ),
              },
              {
                key: 'incidents',
                label: 'Incidents',
                children: (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#888' }}
                  >
                    No incidents
                  </div>
                ),
              },
              {
                key: 'called',
                label: 'Called Process Instances',
                children: (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#888' }}
                  >
                    No called process instances
                  </div>
                ),
              },
              {
                key: 'tasks',
                label: 'User Tasks',
                children: (
                  <Table<Task>
                    rowKey="id"
                    size="small"
                    loading={tasksLoading}
                    dataSource={tasks}
                    pagination={false}
                    columns={[
                      { title: 'Name', dataIndex: 'name' },
                      {
                        title: 'Assignee',
                        dataIndex: 'assignee',
                        render: (v) => v || <Text type="secondary">—</Text>,
                      },
                      {
                        title: 'Created',
                        dataIndex: 'createTime',
                        render: (v: any) =>
                          v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '—',
                      },
                      {
                        title: 'Task Key',
                        dataIndex: 'taskDefinitionKey',
                        render: (v) => (
                          <Text style={{ fontSize: 11, color: '#888' }}>
                            {v}
                          </Text>
                        ),
                      },
                    ]}
                    locale={{ emptyText: 'No active user tasks' }}
                  />
                ),
              },
              {
                key: 'jobs',
                label: 'Jobs',
                children: (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#888' }}
                  >
                    No jobs
                  </div>
                ),
              },
              {
                key: 'external',
                label: 'External Tasks',
                children: (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#888' }}
                  >
                    No external tasks
                  </div>
                ),
              },
            ]}
          />
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
