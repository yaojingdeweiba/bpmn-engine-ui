import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Descriptions,
  Modal,
  message,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import type { ProcessInstance } from '@/services/engine';
import {
  getProcessInstance,
  getProcessInstanceIdActivityInstances,
  postProcessInstanceIdActivate,
  postProcessInstanceIdOpenApiDelete,
  postProcessInstanceIdSuspend,
} from '@/services/workflowengine/processInstance';

const stateColor: Record<string, string> = {
  running: 'processing',
  completed: 'success',
  suspended: 'warning',
  failed: 'error',
};

export default function ProcessInstancePage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [detail, setDetail] = useState<ProcessInstance | null>(null);
  const [activities, setActivities] = useState<any>(null);

  const columns: ProColumns<ProcessInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 240,
      copyable: true,
      ellipsis: true,
    },
    { title: 'Process Key', dataIndex: 'processDefinitionKey' },
    {
      title: 'Business Key',
      dataIndex: 'businessKey',
      render: (v) => v || '-',
    },
    {
      title: 'State',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        running: { text: 'Running', status: 'Processing' },
        completed: { text: 'Completed', status: 'Success' },
        suspended: { text: 'Suspended', status: 'Warning' },
        failed: { text: 'Failed', status: 'Error' },
      },
      render: (_, row) => <Tag color={stateColor[row.state]}>{row.state}</Tag>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, row) => [
        <Tooltip key="view" title="Detail">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setDetail(row)}
          />
        </Tooltip>,
        <Tooltip key="acts" title="Activity Instances">
          <Button
            type="link"
            icon={<ApartmentOutlined />}
            onClick={async () => {
              const res = await getProcessInstanceIdActivityInstances({
                id: row.id,
              });
              setActivities(res);
            }}
          />
        </Tooltip>,
        row.state === 'running' ? (
          <Tooltip key="suspend" title="Suspend">
            <Button
              type="link"
              icon={<PauseCircleOutlined />}
              onClick={async () => {
                await postProcessInstanceIdSuspend({ id: row.id });
                message.success('Suspended');
                actionRef.current?.reload();
              }}
            />
          </Tooltip>
        ) : row.state === 'suspended' ? (
          <Tooltip key="activate" title="Activate">
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={async () => {
                await postProcessInstanceIdActivate({ id: row.id });
                message.success('Activated');
                actionRef.current?.reload();
              }}
            />
          </Tooltip>
        ) : null,
        <Popconfirm
          key="del"
          title="Delete this instance?"
          onConfirm={async () => {
            await postProcessInstanceIdOpenApiDelete({ id: row.id });
            message.success('Deleted');
            actionRef.current?.reload();
          }}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="Process Instances">
      <ProTable<ProcessInstance>
        actionRef={actionRef}
        rowKey="id"
        headerTitle={false}
        columns={columns}
        request={async (params) => {
          const data = await getProcessInstance({
            processDefinitionKey: params.processDefinitionKey,
            businessKey: params.businessKey,
            state: params.state,
            firstResult: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
            maxResults: params.pageSize,
          });
          const list = Array.isArray(data) ? data : [];
          return { data: list, success: true, total: list.length };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="Instance Detail"
        open={!!detail}
        footer={null}
        onCancel={() => setDetail(null)}
        width={640}
      >
        {detail && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{detail.id}</Descriptions.Item>
            <Descriptions.Item label="Process Key">
              {detail.processDefinitionKey}
            </Descriptions.Item>
            <Descriptions.Item label="Business Key">
              {detail.businessKey || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              <Tag color={stateColor[detail.state]}>{detail.state}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {detail.startTime
                ? dayjs(detail.startTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {detail.endTime
                ? dayjs(detail.endTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Activity Instances"
        open={!!activities}
        footer={null}
        onCancel={() => setActivities(null)}
        width={640}
      >
        <pre style={{ fontSize: 12, overflow: 'auto', maxHeight: 400 }}>
          {JSON.stringify(activities, null, 2)}
        </pre>
      </Modal>
    </PageContainer>
  );
}
