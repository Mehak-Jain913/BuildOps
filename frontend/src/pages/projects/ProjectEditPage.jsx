import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Textarea } from '../../components/forms/Textarea';
import { Button } from '../../components/ui/Button';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { PROJECT_TYPES } from '../../mock/projectData';
import { Building2, ArrowLeft, Save, Calendar, User, MapPin, DollarSign, Briefcase } from 'lucide-react';

export const ProjectEditPage = () => {
  const { id, projectId } = useParams();
  const currentId = projectId || id || 'PRJ-001';
  const navigate = useNavigate();

  const { getProjectById, updateProject } = useProjects();
  const { addToast } = useToast();

  const project = getProjectById(currentId);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    client: '',
    location: '',
    type: 'Residential',
    manager: 'Sarah Jenkins',
    startDate: '',
    targetDate: '',
    budget: '',
    description: '',
    status: 'On Track',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        code: project.code || project.id || '',
        client: project.client || '',
        location: project.location || '',
        type: project.type || 'Residential',
        manager: project.manager || 'Sarah Jenkins',
        startDate: project.startDate || '',
        targetDate: project.targetDate || '',
        budget: project.budget !== undefined ? String(project.budget) : '',
        description: project.description || '',
        status: project.status || 'On Track',
      });
    }
  }, [project]);

  if (!project) {
    return (
      <Card className="p-8 text-center bg-white">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Cannot edit project "{currentId}" because it does not exist.
        </p>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Back to Projects List
        </Button>
      </Card>
    );
  }

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

    if (!formData.targetDate) {
      newErrors.targetDate = 'Completion Date is required';
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

    updateProject(project.id, {
      ...formData,
      budget: parseFloat(formData.budget),
    });

    addToast({
      title: 'Project Details Updated',
      message: `"${formData.name}" has been updated successfully.`,
      type: 'success',
    });

    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button Link */}
      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel & Return to Project Details
      </button>

      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <div>
                <h1 className="text-lg font-bold text-slate-900">Edit Project Details</h1>
                <p className="text-xs text-slate-500 font-normal">
                  Update identity, budget, site location, timeline, and operational status.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 text-amber-400">
              {project.code}
            </span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              leftIcon={Building2}
            />

            <Input
              label="Project Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              leftIcon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              name="client"
              value={formData.client}
              onChange={handleChange}
              leftIcon={User}
            />

            <Input
              label="Project Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
              leftIcon={MapPin}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              value={formData.manager}
              onChange={handleChange}
              leftIcon={User}
            />

            <Select
              label="Project Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'Planning', label: 'Planning' },
                { value: 'On Track', label: 'On Track' },
                { value: 'At Risk', label: 'At Risk' },
                { value: 'Delayed', label: 'Delayed' },
                { value: 'Completed', label: 'Completed' },
              ]}
              required
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
              label="Target Completion Date"
              name="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={handleChange}
              error={errors.targetDate}
              required
              leftIcon={Calendar}
            />

            <Input
              label="Budget (in ₹ Lakhs)"
              name="budget"
              type="number"
              step="0.1"
              value={formData.budget}
              onChange={handleChange}
              error={errors.budget}
              required
              leftIcon={DollarSign}
            />
          </div>

          <Textarea
            label="Project Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => navigate(`/projects/${project.id}`)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" leftIcon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
