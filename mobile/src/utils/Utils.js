import { BEAST_MULTIPLIERS, SAFETY_MULTIPLIERS } from './Constants';

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Date utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Number utilities
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Betting utilities
export const getMultiplier = (numPicks, betType) => {
  const multipliers = betType === 'beast' ? BEAST_MULTIPLIERS : SAFETY_MULTIPLIERS;
  return multipliers[numPicks] || multipliers[Object.keys(multipliers).pop()];
};

export const calculatePotentialPayout = (picks, betType, amount) => {
  if (picks.length < 2) return 0;
  
  const totalOdds = picks.reduce((total, pick) => total * pick.odds, 1);
  const multiplier = getMultiplier(picks.length, betType);
  
  return (amount * totalOdds * multiplier);
};

// Color utilities
export const getStatusColor = (status) => {
  switch (status) {
    case 'Won': return '#10b981';
    case 'Lost': return '#ef4444';
    case 'Partially_Won': return '#f59e0b';
    case 'Pending': return '#6b7280';
    default: return '#6b7280';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Won': return 'checkmark-circle';
    case 'Lost': return 'close-circle';
    case 'Partially_Won': return 'warning';
    case 'Pending': return 'time';
    default: return 'help-circle';
  }
};

export default {
  validateEmail,
  validatePassword,
  validateRequired,
  formatDate,
  formatDateTime,
  formatCurrency,
  getMultiplier,
  calculatePotentialPayout,
  getStatusColor,
  getStatusIcon,
};
