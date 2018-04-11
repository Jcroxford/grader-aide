import { decode } from 'jsonwebtoken';

export function isStudentGaurd(to, from, next) {
  const token = window.localStorage.getItem('authorization');

  if (!token) return next('/login');

  const { type } = decode(token);
  if (type === 'student') return next();

  return next('/login');
}

export function isAdminGaurd(to, from, next) {
  const token = window.localStorage.getItem('authorization');

  if (!token) return next('/login');

  const { type } = decode(token);
  if (type === 'admin') return next();

  return next('/login');
}

export function isLoggedInGuard(to, from, next) {
  const token = window.localStorage.getItem('authorization');

  if (!token) return next();

  const { type } = decode(token);
  switch (type) {
    case 'student':
      return next('/student');

    case 'admin':
      return next('/grade-assignment');

    default:
      return next();
  }
}
