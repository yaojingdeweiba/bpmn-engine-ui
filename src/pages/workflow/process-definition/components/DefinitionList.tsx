import { CheckCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Space, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { ProcessDefinition } from '@/services/engine';
import { getProcessDefinition } from '@/services/workflowengine/processDefinition';

const { Text } = Typography;

type StatMap = Record<string, { instances: number }>;

type Props = {
  onSelect: (def: ProcessDefinition) => void;
};

export default function DefinitionList({ onSelect }: Props) {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [statMap, setStatMap] = useState<StatMap>({});
  const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   processDefinitionApi
  //     .statistics()
  //     .then((rows) => {
  //       if (!Array.isArray(rows)) return;
  //       const map: StatMap = {};
  //       rows.forEach((r: any) => {
  //         const id: string = r.definition?.id ?? r.id ?? '';
  //         map[id] = { instances: r.instances ?? 0 };
  //       });
  //       setStatMap(map);
  //     })
  //     .catch(() => {});
  // }, []);

  const columns: ProColumns<ProcessDefinition>[] = [
    {
      title: 'State',
      dataIndex: 'suspended',
      width: 64,
      search: false,
      align: 'center',
      render: (_, row) =>
        row.suspended ? (
          <Tooltip title="Suspended">
            <PauseCircleFilled style={{ color: '#fa8c16', fontSize: 18 }} />
          </Tooltip>
        ) : (
          <Tooltip title="Active">
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
          </Tooltip>
        ),
    },
    {
      title: 'Running Instances',
      dataIndex: 'id',
      width: 150,
      search: false,
      align: 'right',
      render: (_, row) => {
        const n = statMap[row.id]?.instances;
        return n != null ? (
          <Text strong style={{ color: n > 0 ? '#1677ff' : undefined }}>
            {n}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, row) => (
        <Typography.Link onClick={() => onSelect(row)}>
          {row.name || row.key}
        </Typography.Link>
      ),
    },
    {
      title: 'Key',
      dataIndex: 'key',
      width: 220,
      render: (v) => (
        <Text style={{ fontSize: 12, color: '#888' }}>{v as string}</Text>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      search: false,
      width: 80,
      align: 'center',
      render: (v) => (
        <Tag style={{ fontSize: 11, margin: 0 }}>v{v as number}</Tag>
      ),
    },
    {
      title: 'Tenant ID',
      dataIndex: 'tenantId',
      width: 120,
      render: (v) =>
        v ? (
          <Tag color="geekblue" style={{ fontSize: 11, margin: 0 }}>
            {v as string}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <ProTable<ProcessDefinition>
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      headerTitle={
        <Space>
          <Text strong style={{ fontSize: 16 }}>
            {total > 0
              ? `${total} process definitions deployed`
              : 'Process Definitions'}
          </Text>
        </Space>
      }
      search={{ labelWidth: 'auto' }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (t) => `Total ${t}`,
      }}
      options={{ reload: true, density: true, setting: false }}
      request={async (params) => {
        const data = await getProcessDefinition({
          latestVersion: true,
          maxResults: 1000,
          ...(params.name ? { name: params.name } : {}),
          ...(params.key ? { key: params.key } : {}),
        });
        const arr = Array.isArray(data) ? data : [];
        setTotal(arr.length);
        const filtered = params.name
          ? arr.filter((d) =>
              (d.name || d.key)
                .toLowerCase()
                .includes(params.name.toLowerCase()),
            )
          : arr;
        return { data: filtered, success: true, total: filtered.length };
      }}
      onRow={(row) => ({
        onClick: () => onSelect(row),
        style: { cursor: 'pointer' },
      })}
    />
  );
}
