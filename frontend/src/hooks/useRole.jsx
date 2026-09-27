import React, { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles';

const RoleContext = createContext({
  role: ROLES.ADMIN,
  setRole: () => {},
  isRole: () => false,
});

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.ADMIN);

  const isRole = (targetRole) => {
    if (Array.isArray(targetRole)) {
      return targetRole.includes(role);
    }
    return role === targetRole;
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
