import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import { useRole } from '../../hooks/useRole';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { LogIn, Shield, Key } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);

  const handleLogin = (e) => {
    e.preventDefault();
    setRole(selectedRole);
    addToast({
      title: 'Authenticated Successfully',
      message: `Logged in as ${ROLE_LABELS[selectedRole]}`,
      type: 'success',
    });
    navigate('/dashboard');
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Sign In to BuildOps</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select your site role to test role-aware navigation
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Work Email / Username"
          type="email"
          defaultValue="supervisor@buildops.io"
          leftIcon={Key}
          required
        />

        <Input
          label="Password"
          type="password"
          defaultValue="••••••••••••"
          required
        />

        <Select
          label="Select Target Role Context"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          options={Object.values(ROLES).map(r => ({ value: r, label: ROLE_LABELS[r] }))}
          helperText="Simulates backend authentication role token"
        />

        <div className="pt-2">
          <Button type="submit" variant="secondary" fullWidth rightIcon={LogIn}>
            Access Site System
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          BuildOps Phase 0 Foundation • Mock Authentication Demo
        </p>
      </div>
    </div>
  );
};
