import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../constants/roles';
import { useAuth } from './useAuth';

const RoleContext = createContext({
  role: ROLES.ADMIN,
  setRole: () => {},
  isRole: () => false,
});

export const RoleProvider = ({ children }) => {
  const auth = useAuth();
  const [activeRole, setActiveRole] = useState(auth?.role || ROLES.ADMIN);

  // Synchronize role with authenticated user's role whenever user/auth updates
  useEffect(() => {
    if (auth?.role) {
      setActiveRole(auth.role);
    }
  }, [auth?.role]);

  const handleSetRole = (newRole) => {
    setActiveRole(newRole);
    if (auth?.setRole) {
      auth.setRole(newRole);
    }
  };

  const isRole = (targetRole) => {
    const currentRole = activeRole || auth?.role || ROLES.ADMIN;
    if (Array.isArray(targetRole)) {
      return targetRole.includes(currentRole);
    }
    return currentRole === targetRole;
  };

  const currentRole = activeRole || auth?.role || ROLES.ADMIN;

  return (
    <RoleContext.Provider value={{ role: currentRole, setRole: handleSetRole, isRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
