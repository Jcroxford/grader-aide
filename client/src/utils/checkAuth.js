import { decode } from 'jsonwebtoken';

export function getUserAuthType() {
  const token = window.localStorage.getItem('authorization');

  if (!token) return '';
  const { type } = decode(token);

  return type;
}
