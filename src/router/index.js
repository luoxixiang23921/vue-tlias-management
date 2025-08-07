import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/layout/index.vue';
import IndexView from '@/views/index/index.vue';
import ClazzView from '@/views/clazz/index.vue';
import StudentView from '@/views/stu/index.vue';
import DeptView from '@/views/dept/index.vue';
import EmpView from '@/views/emp/index.vue';
import LogView from '@/views/log/index.vue';
import EmpReportView from '@/views/report/emp/index.vue';
import StuReportView from '@/views/report/stu/index.vue';
import LoginView from '@/views/login/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', 
      name: '', 
      component: LayoutView,
      redirect: '/index',
      children: [ 
        { path: 'index', name: 'index', component: IndexView },
        { path: 'clazzs', name: 'clazzs', component: ClazzView },
        { path: 'students', name: 'students', component: StudentView },
        { path: 'depts', name: 'depts', component: DeptView },
        { path: 'emps', name: 'emps', component: EmpView },
        { path: 'log', name: 'log', component: LogView },
        { path: 'empReport', name: 'empReport', component: EmpReportView },
        { path: 'stuReport', name: 'stuReport', component: StuReportView },
      ]
    },
    { path: '/login', name: 'login', component: LoginView }

    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
