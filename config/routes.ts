export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'Dashboard',
    icon: 'DashboardOutlined',
    path: '/workflow/dashboard',
    component: './workflow/dashboard',
  },
  {
    name: 'Deployments',
    icon: 'DeploymentUnitOutlined',
    path: '/workflow/deployment',
    component: './workflow/deployment',
  },
  {
    name: 'Process Definitions',
    icon: 'ApartmentOutlined',
    path: '/workflow/process-definition',
    component: './workflow/process-definition',
  },
  {
    name: 'Process Instances',
    icon: 'PlaySquareOutlined',
    path: '/workflow/process-instance',
    component: './workflow/process-instance',
  },
  {
    name: 'Tasks',
    icon: 'CheckSquareOutlined',
    path: '/workflow/task',
    component: './workflow/task',
  },
  {
    name: 'History',
    icon: 'HistoryOutlined',
    path: '/workflow/history',
    component: './workflow/history',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: '二级管理页',
        component: './Admin',
      },
    ],
  },
  {
    name: '查询表格',
    icon: 'table',
    path: '/list',
    component: './table-list',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './exception/404',
    layout: false,
    path: './*',
  },
];
