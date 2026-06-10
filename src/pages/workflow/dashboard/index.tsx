import {
  ClockCircleOutlined,
  HeartOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import { Alert, Badge, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getEngineStats, getHealth } from '@/services/workflowengine/system';

interface HealthResponse {
  status: string;
  timestamp: string;
}

interface StatsResponse {
  activeEngines: number;
  instanceIds: Array<string>;
}

export default function DashboardPage() {
  const [healthLoading, setHealthLoading] = useState(true);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const isUp = health?.status === 'UP';
  useEffect(() => {
    getHealth()
      .then((res) => setHealth(res))
      .catch(() => setHealth(null))
      .finally(() => setHealthLoading(false));

    getEngineStats()
      .then((res) => setStats(res))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);
  return (
    <PageContainer title="Dashboard">
      <Space orientation="vertical" style={{ width: '100%' }} size={16}>
        <Alert
          type={healthLoading ? 'info' : isUp ? 'success' : 'error'}
          icon={<HeartOutlined />}
          showIcon
          title={
            healthLoading
              ? 'Checking engine...'
              : `Engine: ${health?.status ?? 'OFFLINE'}`
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
              value: stats?.activeEngines ?? '-',
              icon: (
                <PlayCircleOutlined
                  style={{ color: '#1890ff', fontSize: 24 }}
                />
              ),
              valueStyle: { color: '#1890ff' },
            }}
          />
          <StatisticCard
            loading={statsLoading}
            statistic={{
              title: 'Job Executor',
              value: stats?.instanceIds?.length ? 'Running' : 'Stopped',
              icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
              valueStyle: {
                color: stats?.instanceIds?.length ? '#52c41a' : '#ff4d4f',
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
          <ProCard title="Engine Details">
            <pre style={{ margin: 0, fontSize: 12 }}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </ProCard>
        )}
      </Space>
    </PageContainer>
  );
}
