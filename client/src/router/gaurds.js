import { getUserAuthType } from '@/utils/checkAuth';

export function isStudentGaurd(to, from, next) {
  const type = getUserAuthType();

  if (type === 'student') return next();

  return next('/login');
}

export function isAdminGaurd(to, from, next) {
  const type = getUserAuthType();

  if (type === 'admin') return next();

  return next('/login');
}

export function isLoggedInGuard(to, from, next) {
  const type = getUserAuthType();
  switch (type) {
    case 'student':
      return next('/student');

    case 'admin':
      return next('/assignments');

    default:
      return next();
  }
}
