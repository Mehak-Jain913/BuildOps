import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Modal } from '../ui/Modal';
import { EVIDENCE_TYPES } from '../../mock/siteOperationsData';
import { Camera, Calendar, User, Tag, MapPin, Plus, ExternalLink } from 'lucide-react';

export const SiteEvidenceGallery = ({ evidenceList = [], onAddEvidence }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((evi) => {
      const matchSearch =
        evi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evi.capturedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evi.tags && evi.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchType = typeFilter === 'ALL' || evi.type === typeFilter;

      return matchSearch && matchType;
    });
  }, [evidenceList, searchTerm, typeFilter]);

  const getTypeBadge = (type) => {
    let variant = 'blue';
    if (type === 'Safety') variant = 'rose';
    if (type === 'Quality') variant = 'emerald';
    if (type === 'Material Delivery') variant = 'amber';
    if (type === 'Issue') variant = 'purple';
    return <Badge variant={variant} size="xs">{type}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search evidence title, tags, inspector..."
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Evidence Types' },
                ...EVIDENCE_TYPES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>
          {onAddEvidence && (
            <Button variant="amber" size="sm" onClick={onAddEvidence} className="gap-1.5 text-xs">
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEvidence.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                {getTypeBadge(photo.type)}
              </div>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors line-clamp-1">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{photo.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {photo.blockName} ({photo.levelName})
                  </span>
                  <span>{photo.capturedAt.split(' ')[0]}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>By: {photo.capturedBy}</span>
                </div>

                {photo.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {photo.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-950 px-1.5 py-0.5 rounded text-[9px] text-slate-300 border border-slate-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title={`Site Evidence: ${selectedPhoto.title}`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{selectedPhoto.title}</h3>
                {getTypeBadge(selectedPhoto.type)}
              </div>
              <p className="text-slate-300 text-xs">{selectedPhoto.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Project</span>
                  <span className="text-white font-bold">{selectedPhoto.projectName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Location</span>
                  <span className="text-white font-bold">{selectedPhoto.blockName} • {selectedPhoto.levelName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Captured At</span>
                  <span className="text-amber-400 font-bold">{selectedPhoto.capturedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
