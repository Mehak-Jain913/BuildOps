import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Checkbox } from '../../components/forms/Checkbox';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { useRole } from '../../hooks/useRole';
import { ROLE_LABELS, ROLES } from '../../constants/roles';

export const SettingsPage = () => {
  const { addToast } = useToast();
  const { role, setRole } = useRole();

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Settings Saved',
      message: 'System preferences updated successfully.',
      type: 'success',
    });
  };

  return (
    <div>
      <PageHeader
        title="System Settings & Role Configuration"
        subtitle="Manage user profile details, notification triggers, site security policies, and active role context."
      />

      <div className="space-y-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <Card header="User Profile Settings" subtitle="Personal details and role credentials">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue="John Doe" />
                <Input label="Email Address" type="email" defaultValue="john.doe@buildops.io" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Active Testing Role Context"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={Object.values(ROLES).map(r => ({ value: r, label: ROLE_LABELS[r] }))}
                  helperText="Controls sidebar navigation permissions"
                />
                <Input label="Site Designation" defaultValue="Senior Project Director" />
              </div>
            </div>
          </Card>

          <Card header="Notification Preferences" subtitle="Configure automated alert triggers">
            <div className="space-y-3">
              <Checkbox label="High-Risk Material Stockout Alerts" description="Email and SMS when stock drops below 15%" defaultChecked />
              <Checkbox label="Daily Site Log Submissions" description="Notify when site supervisor submits 17:00 report" defaultChecked />
              <Checkbox label="Safety Violation & Hazard Escalations" description="Instant push notifications for Critical safety tickets" defaultChecked />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button">Reset Defaults</Button>
            <Button variant="secondary" type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
