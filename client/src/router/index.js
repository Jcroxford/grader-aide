import Vue from 'vue';
import Router from 'vue-router';

import GradeAssignment from '@/views/GradeAssignment';
import Login from '@/views/Login';
import StudentPlaceholder from '@/views/StudentPlaceholder';

import * as routeGaurds from './gaurds';

Vue.use(Router);

export default new Router({
  routes: [
    // fixme will probably want to redirect to a view of a list of assignments in the future
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      beforeEnter: routeGaurds.isLoggedInGuard,
      component: Login
    },
    {
      path: '/student',
      beforeEnter: routeGaurds.isStudentGaurd,
      component: StudentPlaceholder
    },
    {
      path: '/grade-assignment',
      name: 'GradeAssignment',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: GradeAssignment
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
});
