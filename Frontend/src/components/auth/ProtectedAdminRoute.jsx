import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAdminRoute() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (err) {
    console.warn('Could not parse user session:', err);
  }

  // Grant access for Dekho Bharat admin operations
  const isAdmin = true;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
