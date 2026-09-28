import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Building2, Layers, ChevronRight, ChevronDown, MapPin, Hash, CheckCircle2 } from 'lucide-react';

export const SiteStructureTree = ({ projectName = 'Sunrise Heights', blocks = [], levels = [] }) => {
  const [expandedBlocks, setExpandedBlocks] = useState({
    [blocks[0]?.id || 'BLK-101']: true,
  });

  const toggleBlock = (blockId) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Site Structure & Zone Hierarchy</h3>
              <p className="text-xs text-slate-500 font-normal">
                Project → Block/Zone → Floor/Level Breakdown
              </p>
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            {blocks.length} Blocks / Zones
          </Badge>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Root Project Node */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Root Project</span>
              <h4 className="text-sm font-extrabold text-white">{projectName}</h4>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            Active Site
          </Badge>
        </div>

        {/* Tree Connection Line & Children */}
        <div className="pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-3">
          {blocks.length === 0 ? (
            <div className="p-4 text-xs text-slate-400 italic">No site blocks defined yet.</div>
          ) : (
            blocks.map((block) => {
              const isExpanded = expandedBlocks[block.id];
              const blockLevels = levels.filter((lvl) => lvl.blockId === block.id);

              return (
                <div key={block.id} className="relative group">
                  {/* Branch line */}
                  <div className="absolute -left-4 sm:-left-6 top-5 w-4 sm:w-6 h-0.5 bg-slate-200" />

                  {/* Block Node Container */}
                  <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-2xs hover:border-slate-300">
                    <button
                      onClick={() => toggleBlock(block.id)}
                      className="w-full p-3.5 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded bg-slate-200 text-slate-700">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>{block.name}</span>
                            <span className="text-xs font-normal text-slate-400">• {block.type}</span>
                          </h4>
                        </div>
                      </div>

                      <Badge variant="outline" size="sm">
                        {blockLevels.length} Levels
                      </Badge>
                    </button>

                    {/* Levels List */}
                    {isExpanded && (
                      <div className="p-3 bg-white border-t border-slate-100 space-y-2">
                        {blockLevels.length === 0 ? (
                          <div className="text-xs text-slate-400 px-3 py-1">
                            No floors/levels assigned to this block.
                          </div>
                        ) : (
                          blockLevels.map((lvl) => (
                            <div
                              key={lvl.id}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs hover:border-slate-200 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="font-bold text-slate-800">{lvl.name}</span>
                                {lvl.usage && (
                                  <span className="text-slate-400 text-[11px] truncate max-w-[200px] sm:max-w-xs">
                                    ({lvl.usage})
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                                Level Order #{lvl.order}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
};
