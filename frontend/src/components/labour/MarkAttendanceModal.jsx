import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Button } from '../ui/Button';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { ATTENDANCE_STATUSES } from '../../mock/labourData';
import { Calendar, Clock, User, Building2 } from 'lucide-react';

export const MarkAttendanceModal = ({ isOpen, onClose }) => {
  const { workers, markAttendance } = useLabour();
  const { projects } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    projectId: projects[0]?.id || '',
    workerId: workers[0]?.id || '',
    status: 'Present',
    checkIn: '08:00 AM',
    checkOut: '05:00 PM',
    workingHours: '8.0',
  });

  const selectedWorker = workers.find((w) => w.id === formData.workerId) || workers[0];
  const selectedProject = projects.find((p) => p.id === formData.projectId) || projects[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const res = markAttendance({
      ...formData,
      projectName: selectedProject?.name,
    });

    if (res.success) {
      addToast({
        title: 'Attendance Marked',
        message: `Marked ${formData.status} for ${selectedWorker?.name} (${selectedWorker?.trade}) on ${formData.date}.`,
        type: 'success',
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Daily Site Attendance"
      subtitle="Record worker check-in, check-out, working hours, and shift duty status."
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Attendance
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Attendance Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            leftIcon={Calendar}
          />

          <Select
            label="Project Site"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            required
          />
        </div>

        <Select
          label="Select Worker"
          name="workerId"
          value={formData.workerId}
          onChange={handleChange}
          options={workers.map((w) => ({
            value: w.id,
            label: `${w.name} (${w.employeeCode}) — ${w.trade} [${w.contractorName}]`,
          }))}
          required
        />

        <Select
          label="Attendance Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={ATTENDANCE_STATUSES.map((s) => ({ value: s, label: s }))}
          required
        />

        {formData.status === 'Present' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Check In Time"
                name="checkIn"
                placeholder="e.g. 08:00 AM"
                value={formData.checkIn}
                onChange={handleChange}
                leftIcon={Clock}
              />

              <Input
                label="Check Out Time"
                name="checkOut"
                placeholder="e.g. 05:00 PM"
                value={formData.checkOut}
                onChange={handleChange}
                leftIcon={Clock}
              />
            </div>

            <Input
              label="Total Working Hours"
              name="workingHours"
              type="number"
              step="0.1"
              placeholder="e.g. 8.5"
              value={formData.workingHours}
              onChange={handleChange}
              helperText="Hours above 8.0 will be recorded as overtime."
            />
          </>
        )}
      </form>
    </Modal>
  );
};
