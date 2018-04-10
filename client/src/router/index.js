import Vue from 'vue';
import Router from 'vue-router';
import GradeAssignment from '@/views/GradeAssignment';
import Login from '@/views/Login';

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
      component: Login
    },
    {
      path: '/grade-assignment',
      name: 'GradeAssignment',
      component: GradeAssignment
    },
    {
      path: '*',
      redirect: '/grade-assignment'
    }
  ]
});
