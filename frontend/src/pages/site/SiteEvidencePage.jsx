import React, { useState } from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Textarea } from '../../components/forms/Textarea';
import { Modal } from '../../components/ui/Modal';
import { SiteEvidenceGallery } from '../../components/site/SiteEvidenceGallery';
import { useProjects } from '../../hooks/useProjects';
import { EVIDENCE_TYPES } from '../../mock/siteOperationsData';
import { Camera, Plus } from 'lucide-react';

export const SiteEvidencePage = () => {
  const { siteEvidence, addSiteEvidence } = useSiteOperations();
  const { projects, blocks, levels } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-001');
  const [blockId, setBlockId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [type, setType] = useState('Progress');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80');
  const [capturedBy, setCapturedBy] = useState('Site Inspector');

  const availableBlocks = blocks.filter((b) => b.projectId === projectId);
  const availableLevels = levels.filter((l) => l.blockId === blockId);

  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const proj = projects.find((p) => p.id === projectId);
    const blk = blocks.find((b) => b.id === blockId);
    const lvl = levels.find((l) => l.id === levelId);

    addSiteEvidence({
      projectId,
      projectName: proj?.name || 'Sunrise Heights',
      blockId,
      blockName: blk?.name || 'Block A',
      levelId,
      levelName: lvl?.name || 'Level 1',
      type,
      title,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
      capturedBy,
      tags: [type, blk?.name || 'Site'],
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-400" />
            Site Photographic Evidence & Inspection Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Work progress snapshots, material delivery verification, safety observations, and quality audit photos.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Capture Site Photo</span>
        </Button>
      </div>

      <SiteEvidenceGallery evidenceList={siteEvidence} onAddEvidence={() => setIsModalOpen(true)} />

      {/* Capture Evidence Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Site Photographic Evidence">
        <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project *</label>
              <Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Evidence Type *</label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={EVIDENCE_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Block / Area</label>
              <Select
                value={blockId}
                onChange={(e) => setBlockId(e.target.value)}
                options={[
                  { value: '', label: 'Select Block' },
                  ...availableBlocks.map((b) => ({ value: b.id, label: b.name })),
                ]}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Floor Level</label>
              <Select
                value={levelId}
                onChange={(e) => setLevelId(e.target.value)}
                disabled={!blockId}
                options={[
                  { value: '', label: 'Select Level (Optional)' },
                  ...availableLevels.map((l) => ({ value: l.id, label: l.name })),
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Block A Level 4 Slab Pour Progress"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Observations</label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Slump test sample taken. Mix ratio compliant."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Captured By</label>
              <Input value={capturedBy} onChange={(e) => setCapturedBy(e.target.value)} />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sample Mock Image URL</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="amber" type="submit">
              Save Photo to Gallery
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
