import { useState, useEffect, useRef } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import {
  Typography,
  Tag,
  Space,
  Button,
  Tabs,
  Badge,
  Select,
  Spin,
  Form,
  Modal,
  Input,
  message,
  Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  processDefinitionApi,
  processInstanceApi,
  type ProcessDefinition,
  type ProcessInstance,
} from '@/services/engine';
import BpmnViewer from '@/components/BpmnViewer';

const { Text } = Typography;

const STATE_COLOR: Record<string, 'processing' | 'success' | 'warning' | 'error' | 'default'> = {
  running: 'processing',
  completed: 'success',
  suspended: 'warning',
  failed: 'error',
};

type Props = {
  initialDef: ProcessDefinition;
  onBack: () => void;
  onSelectInstance: (inst: ProcessInstance, def: ProcessDefinition) => void;
};

export default function DefinitionDetail({ initialDef, onBack, onSelectInstance }: Props) {
  const [versions, setVersions] = useState<ProcessDefinition[]>([]);
  const [selectedDef, setSelectedDef] = useState<ProcessDefinition>(initialDef);
  const [xml, setXml] = useState<string | null>(null);
  const [xmlLoading, setXmlLoading] = useState(false);
  const [instanceCountCurrent, setInstanceCountCurrent] = useState<number | null>(null);
  const [instanceCountAll, setInstanceCountAll] = useState<number | null>(null);
  const [startVisible, setStartVisible] = useState(false);
  const [startForm] = Form.useForm();
  const instanceRef = useRef<ActionType>();

  useEffect(() => {
    processDefinitionApi
      .list({ key: initialDef.key, maxResults: 100 })
      .then((d) => {
        const sorted = (Array.isArray(d) ? d : []).sort((a, b) => b.version - a.version);
        setVersions(sorted);
      });
  }, [initialDef.key]);

  useEffect(() => {
    if (!selectedDef) return;
    setXmlLoading(true);
    setXml(null);
    processDefinitionApi
      .getXml(selectedDef.id)
      .then((r) => setXml(r?.bpmn20Xml ?? ''))
      .catch(() => setXml(''))
      .finally(() => setXmlLoading(false));
    setTimeout(() => instanceRef.current?.reload(), 0);
  }, [selectedDef?.id]);

  useEffect(() => {
    processInstanceApi
      .list({ processDefinitionKey: selectedDef.key, maxResults: 1000 })
      .then((d) => {
        const all = Array.isArray(d) ? d : [];
        setInstanceCountAll(all.length);
        setInstanceCountCurrent(
          all.filter((i) => i.processDefinitionId === selectedDef.id).length,
        );
      })
      .catch(() => {});
  }, [selectedDef.id, selectedDef.key]);

  const handleStart = async () => {
    const values = await startForm.validateFields();
    let variables: Record<string, unknown> = {};
    try {
      variables = values.variables ? JSON.parse(values.variables) : {};
    } catch {
      message.error('Variables must be valid JSON');
      return;
    }
    await processDefinitionApi.startById(selectedDef.id, {
      variables,
      businessKey: values.businessKey,
    });
    message.success('Process instance started');
    setStartVisible(false);
    startForm.resetFields();
    instanceRef.current?.reload();
  };

  const instanceCols: ProColumns<ProcessInstance>[] = [
    {
      title: 'State',
      dataIndex: 'state',
      search: false,
      width: 110,
      render: (_, r) => <Badge status={STATE_COLOR[r.state]} text={r.state} />,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
      copyable: true,
      search: false,
      render: (_, row) => (
        <Typography.Link
          onClick={() => onSelectInstance(row, selectedDef)}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        >
          {row.id}
        </Typography.Link>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      search: false,
      width: 155,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Business Key',
      dataIndex: 'businessKey',
      search: false,
      render: (v) => v || <Text type="secondary">—</Text>,
    },
    {
      title: '',
      valueType: 'option',
      width: 80,
      render: (_, row) => [
        row.state === 'running' ? (
          <Button
            key="s"
            type="link"
            size="small"
            icon={<PauseCircleOutlined />}
            onClick={async (e) => {
              e.stopPropagation();
              await processInstanceApi.suspend(row.id);
              message.success('Suspended');
              instanceRef.current?.reload();
            }}
          />
        ) : row.state === 'suspended' ? (
          <Button
            key="a"
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={async (e) => {
              e.stopPropagation();
              await processInstanceApi.activate(row.id);
              message.success('Activated');
              instanceRef.current?.reload();
            }}
          />
        ) : null,
        <Popconfirm
          key="d"
          title="Delete this instance?"
          onConfirm={async () => {
            await processInstanceApi.delete(row.id);
            message.success('Deleted');
            instanceRef.current?.reload();
          }}
        >
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>,
      ],
    },
  ];

  const metaRows: { label: string; content: React.ReactNode }[] = [
    {
      label: 'Definition Version',
      content: (
        <Select
          value={selectedDef.id}
          size="small"
          style={{ width: '100%' }}
          options={versions.map((v) => ({ value: v.id, label: `v${v.version}` }))}
          onChange={(id) => setSelectedDef(versions.find((v) => v.id === id) ?? selectedDef)}
        />
      ),
    },
    {
      label: 'Definition ID',
      content: (
        <Text copyable style={{ fontSize: 13 }}>
          {selectedDef.id.slice(0, 24)}…
        </Text>
      ),
    },
    { label: 'Definition Key', content: <Text style={{ fontSize: 14 }}>{selectedDef.key}</Text> },
    {
      label: 'Definition Name',
      content: <Text style={{ fontSize: 14 }}>{selectedDef.name || '—'}</Text>,
    },
    {
      label: 'Tenant ID',
      content: selectedDef.tenantId ? (
        <Tag color="geekblue" style={{ fontSize: 13 }}>
          {selectedDef.tenantId}
        </Tag>
      ) : (
        <Text type="secondary">—</Text>
      ),
    },
    {
      label: 'Deployment ID',
      content: (
        <Text copyable style={{ fontSize: 13 }}>
          {selectedDef.deploymentId?.slice(0, 24)}…
        </Text>
      ),
    },
    ...(selectedDef.suspended
      ? [{ label: 'Status', content: <Tag color="orange">Suspended</Tag> }]
      : []),
  ];

  return (
    <ProCard split="vertical" bordered>
      {/* Left sidebar */}
      <ProCard colSpan={320} style={{ minHeight: 600 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={0}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            size="small"
            onClick={onBack}
            style={{ paddingLeft: 0, color: '#1677ff', marginBottom: 8 }}
          >
            All Processes
          </Button>
          <Text type="secondary" style={{ fontSize: 12, wordBreak: 'break-all' }}>
            Processes » {selectedDef.name || selectedDef.key}
          </Text>

          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }} size={12}>
            {metaRows.map(({ label, content }) => (
              <ProCard key={label} size="small" bordered={false} style={{ padding: 0 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>{label}:</div>
                <div style={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-all' }}>
                  {content}
                </div>
              </ProCard>
            ))}
          </Space>

          <ProCard size="small" bordered style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>Instances Running</div>
            {instanceCountCurrent !== null ? (
              <>
                <div style={{ fontSize: 14, marginBottom: 2 }}>
                  current version:{' '}
                  <Text strong style={{ color: '#1677ff' }}>
                    {instanceCountCurrent}
                  </Text>
                </div>
                <div style={{ fontSize: 14 }}>
                  all versions: <Text strong>{instanceCountAll}</Text>
                </div>
              </>
            ) : (
              <Spin size="small" />
            )}
          </ProCard>

          <Space direction="vertical" style={{ width: '100%', marginTop: 12 }} size={8}>
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              disabled={selectedDef.suspended}
              block
              onClick={() => setStartVisible(true)}
            >
              Start Instance
            </Button>
            {selectedDef.suspended ? (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                block
                onClick={async () => {
                  await processDefinitionApi.setSuspended(selectedDef.id, false);
                  message.success('Activated');
                  setSelectedDef({ ...selectedDef, suspended: false });
                }}
              >
                Activate
              </Button>
            ) : (
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                block
                onClick={async () => {
                  await processDefinitionApi.setSuspended(selectedDef.id, true);
                  message.success('Suspended');
                  setSelectedDef({ ...selectedDef, suspended: true });
                }}
              >
                Suspend
              </Button>
            )}
          </Space>
        </Space>
      </ProCard>

      {/* Main content */}
      <ProCard direction="column">
        <ProCard title="Process Diagram" bordered style={{ marginBottom: 12 }}>
          {xmlLoading ? (
            <div
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}
            >
              <Spin />
            </div>
          ) : xml ? (
            <BpmnViewer xml={xml} height={320} />
          ) : (
            <div
              style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text type="secondary">No diagram available</Text>
            </div>
          )}
        </ProCard>

        <ProCard bordered>
          <Tabs
            defaultActiveKey="instances"
            size="small"
            items={[
              {
                key: 'instances',
                label: 'Process Instances',
                children: (
                  <ProTable<ProcessInstance>
                    actionRef={instanceRef}
                    rowKey="id"
                    columns={instanceCols}
                    search={false}
                    options={{ reload: true, density: false, setting: false }}
                    pagination={{
                      pageSize: 10,
                      size: 'small',
                      hideOnSinglePage: true,
                      showTotal: (t) => `${t} instances`,
                    }}
                    request={async () => {
                      const data = await processInstanceApi.list({
                        processDefinitionKey: selectedDef.key,
                        maxResults: 500,
                      });
                      return { data: Array.isArray(data) ? data : [], success: true };
                    }}
                    onRow={(row) => ({
                      onClick: () => onSelectInstance(row, selectedDef),
                      style: { cursor: 'pointer' },
                    })}
                  />
                ),
              },
              {
                key: 'incidents',
                label: 'Incidents',
                children: (
                  <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                    No incidents
                  </div>
                ),
              },
              {
                key: 'called',
                label: 'Called Process Definitions',
                children: (
                  <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                    No called process definitions
                  </div>
                ),
              },
              {
                key: 'jobs',
                label: 'Job Definitions',
                children: (
                  <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                    No job definitions
                  </div>
                ),
              },
            ]}
          />
        </ProCard>
      </ProCard>

      <Modal
        title={`Start: ${selectedDef.name || selectedDef.key}`}
        open={startVisible}
        onOk={handleStart}
        onCancel={() => {
          setStartVisible(false);
          startForm.resetFields();
        }}
        okText="Start"
        destroyOnHidden
      >
        <Form form={startForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="Business Key" name="businessKey">
            <Input placeholder="optional" />
          </Form.Item>
          <Form.Item label="Variables (JSON)" name="variables">
            <Input.TextArea rows={5} placeholder={'{\n  "key": "value"\n}'} />
          </Form.Item>
        </Form>
      </Modal>
    </ProCard>
  );
}
