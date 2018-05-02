import Vue from 'vue';
import Router from 'vue-router';

import GradeAssignment from '@/views/GradeAssignment';
import CreateAssignment from '@/views/CreateAssignment';
import CreateCourse from '@/views/CreateCourse';
import Login from '@/views/Login';
import StudentCourseList from '@/views/StudentCourseList';
import StudentAssignmentList from '@/views/StudentAssignmentList';
import StudentAssignmentCheck from '@/views/StudentAssignmentCheck';
import AssignmentList from '@/views/AssignmentList';
import CourseList from '@/views/CourseList';

import * as routeGaurds from './gaurds';

Vue.use(Router);

export default new Router({
  routes: [
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
      component: StudentCourseList
    },
    {
      path: '/student/courses/:courseId',
      beforeEnter: routeGaurds.isStudentGaurd,
      component: StudentAssignmentList
    },
    {
      path: '/student/course/:courseId/assignment/:assignmentId',
      beforeEnter: routeGaurds.isStudentGaurd,
      component: StudentAssignmentCheck
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
