import { useRequest } from '@umijs/max';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Alert, Badge, Space } from 'antd';
import {
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  HeartOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { systemApi } from '@/services/engine';

const { Statistic } = StatisticCard;

export default function DashboardPage() {
  const { data: health, loading: healthLoading } = useRequest(systemApi.health, {
    pollingInterval: 30000,
  });
  const { data: stats, loading: statsLoading } = useRequest(systemApi.stats, {
    pollingInterval: 30000,
  });

  const isUp = health?.status === 'UP';

  return (
    <PageContainer title="Dashboard">
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Alert
          type={healthLoading ? 'info' : isUp ? 'success' : 'error'}
          icon={<HeartOutlined />}
          showIcon
          message={
            healthLoading ? 'Checking engine...' : `Engine: ${health?.status ?? 'OFFLINE'}`
          }
          description={
            health?.timestamp
              ? `Last checked: ${new Date(health.timestamp).toLocaleString()}`
              : undefined
          }
        />

        <StatisticCard.Group>
          <StatisticCard
            loading={statsLoading}
            statistic={{
              title: 'Active Instances (memory)',
              value: (stats as any)?.activeEngines ?? '-',
              icon: <PlayCircleOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
              valueStyle: { color: '#1890ff' },
            }}
          />
          <StatisticCard
            loading={statsLoading}
            statistic={{
              title: 'Max Memory Instances',
              value: (stats as any)?.maxMemoryInstances ?? '-',
              icon: <DeploymentUnitOutlined style={{ fontSize: 24 }} />,
            }}
          />
          <StatisticCard
            loading={statsLoading}
            statistic={{
              title: 'Job Executor',
              value: (stats as any)?.jobExecutorRunning ? 'Running' : 'Stopped',
              icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
              valueStyle: {
                color: (stats as any)?.jobExecutorRunning ? '#52c41a' : '#ff4d4f',
              },
            }}
          />
          <StatisticCard
            loading={healthLoading}
            statistic={{
              title: 'Engine Health',
              value: health?.status ?? 'Checking...',
              icon: (
                <Badge
                  status={isUp ? 'processing' : 'error'}
                  style={{ marginRight: 4 }}
                />
              ),
            }}
          />
        </StatisticCard.Group>

        {stats && (
          <ProCard title="Engine Details" bordered>
            <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(stats, null, 2)}</pre>
          </ProCard>
        )}
      </Space>
    </PageContainer>
  );
}
