import Vue from 'vue';
import Router from 'vue-router';

import GradeAssignment from '@/views/GradeAssignment';
import CreateAssignment from '@/views/CreateAssignment';
import CreateCourse from '@/views/CreateCourse';
import Login from '@/views/Login';
import StudentPlaceholder from '@/views/StudentPlaceholder';
import AssignmentList from '@/views/AssignmentList';
import CourseList from '@/views/CourseList';

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
      path: '/courses',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: CourseList
    },
    {
      path: '/courses/:courseId',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: AssignmentList
    },
    {
      path: '/course/:courseId/grade-assignment/:assignmentId',
      name: 'GradeAssignment',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: GradeAssignment
    },
    {
      path: '/create-course',
      name: 'CreateCourse',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: CreateCourse
    },
    {
      path: '/courses/:courseId/create-assignment',
      name: 'CreateAssignment',
      beforeEnter: routeGaurds.isAdminGaurd,
      component: CreateAssignment
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
});
