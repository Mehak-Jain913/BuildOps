import { ROLES, ROLE_LABELS } from '../constants/roles';

/**
 * Mock authentication dataset separated from UI components
 * Simulates backend database records for testing role-based access before Spring Security implementation
 */
export const MOCK_AUTH_USERS = [
  {
    id: 'USR-001',
    name: 'Sarah Jenkins',
    email: 'manager@buildops.com',
    role: ROLES.ADMIN,
    roleName: ROLE_LABELS[ROLES.ADMIN],
    jobTitle: 'Project Manager & Systems Admin',
    avatarInitials: 'SJ',
    token: 'mock-jwt-token-admin-sarah-jenkins',
  },
  {
    id: 'USR-002',
    name: 'David Miller',
    email: 'supervisor@buildops.com',
    role: ROLES.SUPERVISOR,
    roleName: ROLE_LABELS[ROLES.SUPERVISOR],
    jobTitle: 'Senior Site Supervisor',
    avatarInitials: 'DM',
    token: 'mock-jwt-token-supervisor-david-miller',
  },
  {
    id: 'USR-003',
    name: 'Apex Steel Corp',
    email: 'supplier@buildops.com',
    role: ROLES.SUPPLIER,
    roleName: ROLE_LABELS[ROLES.SUPPLIER],
    jobTitle: 'Material & Hardware Supplier',
    avatarInitials: 'AS',
    token: 'mock-jwt-token-supplier-apex-steel',
  },
  {
    id: 'USR-004',
    name: 'Marcus Vance',
    email: 'worker@buildops.com',
    role: ROLES.WORKER,
    roleName: ROLE_LABELS[ROLES.WORKER],
    jobTitle: 'Site Specialist / Foreman',
    avatarInitials: 'MV',
    token: 'mock-jwt-token-worker-marcus-vance',
  },
];

// Alias mapping for flexibility (e.g. admin@buildops.com)
const EMAIL_ALIASES = {
  'admin@buildops.com': 'manager@buildops.com',
};

/**
 * Authenticates email & password against mock dataset
 */
export const authenticateUser = (email, password) => {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const targetEmail = EMAIL_ALIASES[normalizedEmail] || normalizedEmail;

  const foundUser = MOCK_AUTH_USERS.find(
    (u) => u.email.toLowerCase() === targetEmail
  );

  if (!foundUser) {
    return { success: false, error: 'Unable to sign in. Please check your credentials.' };
  }

  // For development mock login, accept password length >= 4 or any non-empty mock password
  if (password.trim().length < 4) {
    return { success: false, error: 'Unable to sign in. Please check your credentials.' };
  }

  return {
    success: true,
    user: foundUser,
  };
};

/**
 * Find user details by email
 */
export const findUserByEmail = (email) => {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const targetEmail = EMAIL_ALIASES[normalizedEmail] || normalizedEmail;
  return MOCK_AUTH_USERS.find((u) => u.email.toLowerCase() === targetEmail) || null;
};
