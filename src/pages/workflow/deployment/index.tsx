import {
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  PartitionOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import BpmnViewer from '@/components/BpmnViewer';
import {
  type Deployment,
  deploymentApi,
  type ProcessDefinition,
  processDefinitionApi,
} from '@/services/engine';

type DiagramState = {
  loading: boolean;
  defs: Array<ProcessDefinition & { xml?: string }>;
};

export default function DeploymentPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [deployOpen, setDeployOpen] = useState(false);
  const [detail, setDetail] = useState<Deployment | null>(null);
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [diagram, setDiagram] = useState<DiagramState>({
    loading: false,
    defs: [],
  });
  const [form] = Form.useForm();

  const columns: ProColumns<Deployment>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 240,
      copyable: true,
      ellipsis: true,
    },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Tenant',
      dataIndex: 'tenantId',
      render: (v) => v || <Tag>default</Tag>,
    },
    {
      title: 'Deploy Time',
      dataIndex: 'deploymentTime',
      render: (v: any) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, row) => [
        <Tooltip key="diagram" title="View Diagram">
          <Button
            type="link"
            icon={<PartitionOutlined />}
            onClick={async () => {
              setDiagramOpen(true);
              setDiagram({ loading: true, defs: [] });
              const defs = (await processDefinitionApi.list({
                deploymentId: row.id,
                firstResult: 0,
                maxResults: 100,
              })) as ProcessDefinition[];
              const defList = Array.isArray(defs) ? defs : [];
              const defsWithXml = await Promise.all(
                defList.map(async (d) => {
                  try {
                    const res = await processDefinitionApi.getXml(d.id);
                    return { ...d, xml: res?.bpmn20Xml };
                  } catch {
                    return d;
                  }
                }),
              );
              setDiagram({ loading: false, defs: defsWithXml });
            }}
          />
        </Tooltip>,
        <Tooltip key="view" title="View Detail">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setDetail(row)}
          />
        </Tooltip>,
        <Popconfirm
          key="del"
          title="Delete this deployment?"
          onConfirm={async () => {
            await deploymentApi.delete(row.id);
            message.success('Deleted');
            actionRef.current?.reload();
          }}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  const handleDeploy = async () => {
    const values = await form.validateFields();
    const fd = new FormData();
    fd.append('deployment-name', values.name || 'default');
    if (values.tenantId) fd.append('tenant-id', values.tenantId);
    const file = values.file?.[0]?.originFileObj;
    if (!file) {
      message.error('Please select a BPMN file');
      return;
    }
    fd.append('file', file, file.name);
    await deploymentApi.create(fd);
    message.success('Deployed successfully');
    setDeployOpen(false);
    form.resetFields();
    actionRef.current?.reload();
  };

  return (
    <PageContainer title="Deployments">
      <ProTable<Deployment>
        actionRef={actionRef}
        rowKey="id"
        headerTitle={false}
        columns={columns}
        request={async (params) => {
          const data = await deploymentApi.list({
            name: params.name,
            firstResult: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
            maxResults: params.pageSize,
          });
          const list = Array.isArray(data) ? data : [];
          return { data: list, success: true, total: list.length };
        }}
        toolBarRender={() => [
          <Button
            key="deploy"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDeployOpen(true)}
          >
            Deploy BPMN
          </Button>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="Deploy BPMN Process"
        open={deployOpen}
        onOk={handleDeploy}
        onCancel={() => {
          setDeployOpen(false);
          form.resetFields();
        }}
        okText="Deploy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Deployment Name" name="name" initialValue="default">
            <Input placeholder="e.g. order-process" />
          </Form.Item>
          <Form.Item label="Tenant ID" name="tenantId">
            <Input placeholder="optional" />
          </Form.Item>
          <Form.Item
            label="BPMN File"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[{ required: true, message: 'Please select a BPMN file' }]}
          >
            <Upload.Dragger
              accept=".bpmn,.xml"
              beforeUpload={() => false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p>Click or drag BPMN file here</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Process Diagrams"
        open={diagramOpen}
        footer={null}
        onCancel={() => setDiagramOpen(false)}
        width={920}
        styles={{ body: { minHeight: 400 } }}
      >
        {diagram.loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : diagram.defs.length === 0 ? (
          <Empty description="No process definitions found for this deployment" />
        ) : (
          <Tabs
            items={diagram.defs.map((d) => ({
              key: d.id,
              label: d.name || d.key,
              children: d.xml ? (
                <Tabs
                  defaultActiveKey="diagram"
                  items={[
                    {
                      key: 'diagram',
                      label: 'Diagram',
                      children: <BpmnViewer xml={d.xml} height={500} />,
                    },
                    {
                      key: 'xml',
                      label: 'XML',
                      children: (
                        <pre
                          style={{
                            fontSize: 11,
                            overflow: 'auto',
                            maxHeight: 500,
                            margin: 0,
                          }}
                        >
                          {d.xml}
                        </pre>
                      ),
                    },
                  ]}
                />
              ) : (
                <Empty description="XML not available" />
              ),
            }))}
          />
        )}
      </Modal>

      <Modal
        title="Deployment Detail"
        open={!!detail}
        footer={null}
        onCancel={() => setDetail(null)}
        width={600}
      >
        <pre style={{ fontSize: 12, overflow: 'auto', maxHeight: 400 }}>
          {JSON.stringify(detail, null, 2)}
        </pre>
      </Modal>
    </PageContainer>
  );
}
