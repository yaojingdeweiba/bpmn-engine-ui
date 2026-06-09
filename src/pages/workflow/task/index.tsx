import { useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Tooltip, Modal, Form, Input, message, Descriptions, Badge } from 'antd';
import { CheckOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { taskApi, type Task } from '@/services/engine';

export default function TaskPage() {
  const actionRef = useRef<ActionType>();
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [completeTask, setCompleteTask] = useState<Task | null>(null);
  const [claimTask, setClaimTask] = useState<Task | null>(null);
  const [completeForm] = Form.useForm();
  const [claimForm] = Form.useForm();

  const columns: ProColumns<Task>[] = [
    { title: 'ID', dataIndex: 'id', width: 220, copyable: true, ellipsis: true },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      render: (v) =>
        v ? (
          <Tag icon={<UserOutlined />} color="blue">
            {v as string}
          </Tag>
        ) : (
          <Badge status="warning" text="Unassigned" />
        ),
    },
    {
      title: 'Process Instance',
      dataIndex: 'processInstanceId',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'Form Key',
      dataIndex: 'formKey',
      search: false,
      render: (v) => (v ? <Tag color="purple">{v as string}</Tag> : '-'),
    },
    {
      title: 'Created',
      dataIndex: 'createTime',
      search: false,
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, row) => [
        <Tooltip key="view" title="Detail">
          <Button type="link" icon={<EyeOutlined />} onClick={() => setTaskDetail(row)} />
        </Tooltip>,
        <Tooltip key="claim" title={row.assignee ? 'Unclaim' : 'Claim'}>
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => {
              if (row.assignee) {
                taskApi.unclaim(row.id).then(() => {
                  message.success('Unclaimed');
                  actionRef.current?.reload();
                });
              } else {
                setClaimTask(row);
              }
            }}
          />
        </Tooltip>,
        <Tooltip key="complete" title="Complete">
          <Button type="link" icon={<CheckOutlined />} onClick={() => setCompleteTask(row)} />
        </Tooltip>,
      ],
    },
  ];

  const handleComplete = async () => {
    const values = await completeForm.validateFields();
    let variables: Record<string, unknown> = {};
    try {
      variables = values.variables ? JSON.parse(values.variables) : {};
    } catch {
      message.error('Variables must be valid JSON');
      return;
    }
    await taskApi.complete(completeTask!.id, variables);
    message.success('Task completed');
    setCompleteTask(null);
    completeForm.resetFields();
    actionRef.current?.reload();
  };

  const handleClaim = async () => {
    const values = await claimForm.validateFields();
    await taskApi.claim(claimTask!.id, values.userId);
    message.success('Claimed');
    setClaimTask(null);
    claimForm.resetFields();
    actionRef.current?.reload();
  };

  return (
    <PageContainer title="User Tasks">
      <ProTable<Task>
        actionRef={actionRef}
        rowKey="id"
        headerTitle={false}
        columns={columns}
        request={async (params) => {
          const data = await taskApi.list({
            processInstanceId: params.processInstanceId,
            processDefinitionKey: params.processDefinitionKey,
            assignee: params.assignee,
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
        title="Task Detail"
        open={!!taskDetail}
        footer={null}
        onCancel={() => setTaskDetail(null)}
        width={640}
      >
        {taskDetail && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{taskDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{taskDetail.name}</Descriptions.Item>
            <Descriptions.Item label="Definition Key">
              {taskDetail.taskDefinitionKey}
            </Descriptions.Item>
            <Descriptions.Item label="Assignee">
              {taskDetail.assignee || 'Unassigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Form Key">{taskDetail.formKey || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Process Instance">
              {taskDetail.processInstanceId}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {taskDetail.createTime
                ? dayjs(taskDetail.createTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={`Complete: ${completeTask?.name}`}
        open={!!completeTask}
        onOk={handleComplete}
        onCancel={() => {
          setCompleteTask(null);
          completeForm.resetFields();
        }}
        okText="Complete"
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item label="Variables (JSON)" name="variables">
            <Input.TextArea
              rows={6}
              placeholder={'{\n  "approved": true,\n  "comment": "OK"\n}'}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Claim Task"
        open={!!claimTask}
        onOk={handleClaim}
        onCancel={() => {
          setClaimTask(null);
          claimForm.resetFields();
        }}
        okText="Claim"
      >
        <Form form={claimForm} layout="vertical">
          <Form.Item label="User ID" name="userId" rules={[{ required: true }]}>
            <Input placeholder="Enter your user ID" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
