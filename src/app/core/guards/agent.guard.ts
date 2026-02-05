import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const agentGuard = () => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');
  if (role === 'AGENT' || role === 'ADMIN') return true;
  router.navigate(['/']);
  return false;
};
