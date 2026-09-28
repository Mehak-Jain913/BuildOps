import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { PROJECT_TYPES } from '../../mock/projectData';
import { useToast } from '../../hooks/useToast';
import { Building2, Calendar, DollarSign, User, MapPin, Briefcase } from 'lucide-react';

export const CreateProjectModal = ({ isOpen, onClose, onSubmitProject }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    client: '',
    location: '',
    type: 'Residential',
    manager: 'Sarah Jenkins',
    startDate: '',
    expectedCompletion: '',
    budget: '',
    description: '',
    status: 'Planning',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project Name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Project Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required';
    }

    if (!formData.expectedCompletion) {
      newErrors.expectedCompletion = 'Expected Completion Date is required';
    } else if (formData.startDate && new Date(formData.expectedCompletion) <= new Date(formData.startDate)) {
      newErrors.expectedCompletion = 'Completion date must be after start date';
    }

    if (!formData.budget) {
      newErrors.budget = 'Project Budget is required';
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a valid positive amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const codeToUse = formData.code.trim() || `PRJ-${Math.floor(100 + Math.random() * 900)}`;

    const created = onSubmitProject({
      ...formData,
      code: codeToUse,
    });

    addToast({
      title: 'Project Created Successfully',
      message: `"${formData.name}" (${codeToUse}) has been created in local project portfolio.`,
      type: 'success',
    });

    // Reset Form
    setFormData({
      name: '',
      code: '',
      client: '',
      location: '',
      type: 'Residential',
      manager: 'Sarah Jenkins',
      startDate: '',
      expectedCompletion: '',
      budget: '',
      description: '',
      status: 'Planning',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Construction Project"
      subtitle="Establish project identity, site location, timeline targets, and financial budget allocation."
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            name="name"
            placeholder="e.g. Sunrise Heights"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            leftIcon={Building2}
          />

          <Input
            label="Project Code"
            name="code"
            placeholder="e.g. SH-2026-001 (auto-generated if empty)"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            leftIcon={Briefcase}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            name="client"
            placeholder="e.g. Apex Realty Group"
            value={formData.client}
            onChange={handleChange}
            leftIcon={User}
          />

          <Input
            label="Project Location"
            name="location"
            placeholder="e.g. Indore, Madhya Pradesh"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
            leftIcon={MapPin}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
            required
          />

          <Input
            label="Project Manager"
            name="manager"
            placeholder="e.g. Sarah Jenkins"
            value={formData.manager}
            onChange={handleChange}
            leftIcon={User}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
            leftIcon={Calendar}
          />

          <Input
            label="Expected Completion"
            name="expectedCompletion"
            type="date"
            value={formData.expectedCompletion}
            onChange={handleChange}
            error={errors.expectedCompletion}
            required
            leftIcon={Calendar}
          />

          <Input
            label="Budget (in ₹ Lakhs)"
            name="budget"
            type="number"
            step="0.1"
            placeholder="e.g. 50.0"
            value={formData.budget}
            onChange={handleChange}
            error={errors.budget}
            required
            leftIcon={DollarSign}
            helperText="Enter budget in ₹ Lakhs (e.g. 50 for 50L, 280 for 2.8Cr)"
          />
        </div>

        <Textarea
          label="Project Description"
          name="description"
          placeholder="Brief description of the construction scope, architectural plan, and site specifics..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </form>
    </Modal>
  );
};
