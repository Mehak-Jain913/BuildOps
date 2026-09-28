import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Button } from '../ui/Button';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { WORKER_TRADES, SKILL_LEVELS } from '../../mock/labourData';
import { User, Calendar, Phone, DollarSign, Briefcase } from 'lucide-react';

export const AddWorkerModal = ({ isOpen, onClose }) => {
  const { contractors, addWorker } = useLabour();
  const { projects } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    employeeCode: '',
    phone: '',
    trade: 'Mason',
    skillLevel: 'Skilled',
    contractorId: contractors[0]?.id || '',
    projectId: projects[0]?.id || '',
    joiningDate: new Date().toISOString().split('T')[0],
    dailyRate: '',
    overtimeRate: '',
    status: 'Active',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Worker Name is required';
    if (!formData.trade) newErrors.trade = 'Trade category is required';
    if (!formData.contractorId) newErrors.contractorId = 'Contractor is required';
    if (!formData.dailyRate || parseFloat(formData.dailyRate) <= 0) {
      newErrors.dailyRate = 'Daily Rate must be a valid positive amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedProjectObj = projects.find((p) => p.id === formData.projectId);

    const res = addWorker({
      ...formData,
      projectName: selectedProjectObj?.name || 'Sunrise Heights',
      overtimeRate: formData.overtimeRate || Math.round(parseFloat(formData.dailyRate) / 6),
    });

    if (res.success) {
      addToast({
        title: 'Worker Registered',
        message: `${formData.name} (${res.worker.employeeCode}) added to workforce directory.`,
        type: 'success',
      });
      setFormData({
        name: '',
        employeeCode: '',
        phone: '',
        trade: 'Mason',
        skillLevel: 'Skilled',
        contractorId: contractors[0]?.id || '',
        projectId: projects[0]?.id || '',
        joiningDate: new Date().toISOString().split('T')[0],
        dailyRate: '',
        overtimeRate: '',
        status: 'Active',
        emergencyContact: '',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Site Worker"
      subtitle="Add site worker profile, contractor mapping, trade category, and wage rates."
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Register Worker
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Worker Full Name"
            name="name"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            leftIcon={User}
          />

          <Input
            label="Employee / Worker Code"
            name="employeeCode"
            placeholder="e.g. WRK-1009 (auto if empty)"
            value={formData.employeeCode}
            onChange={handleChange}
            leftIcon={Briefcase}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Trade Category"
            name="trade"
            value={formData.trade}
            onChange={handleChange}
            options={WORKER_TRADES.map((t) => ({ value: t, label: t }))}
            error={errors.trade}
            required
          />

          <Select
            label="Skill Level"
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            options={SKILL_LEVELS.map((s) => ({ value: s, label: s }))}
            required
          />

          <Select
            label="Labor Contractor"
            name="contractorId"
            value={formData.contractorId}
            onChange={handleChange}
            options={contractors.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.contractorId}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Project Site"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <Input
            label="Contact Phone"
            name="phone"
            placeholder="e.g. +91 98765-43210"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={Phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Daily Wage Rate (₹/day)"
            name="dailyRate"
            type="number"
            placeholder="e.g. 900"
            value={formData.dailyRate}
            onChange={handleChange}
            error={errors.dailyRate}
            required
            leftIcon={DollarSign}
          />

          <Input
            label="Overtime Rate (₹/hr)"
            name="overtimeRate"
            type="number"
            placeholder="e.g. 150"
            value={formData.overtimeRate}
            onChange={handleChange}
            leftIcon={DollarSign}
          />

          <Input
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            leftIcon={Calendar}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Phone"
            name="emergencyContact"
            placeholder="e.g. +91 98765-99999"
            value={formData.emergencyContact}
            onChange={handleChange}
            leftIcon={Phone}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Active', label: 'Active On Site' },
              { value: 'Inactive', label: 'Inactive / Discharged' },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
};
