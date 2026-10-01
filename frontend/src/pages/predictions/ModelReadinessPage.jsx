import React from 'react';
import { FUTURE_MODEL_CANDIDATES, PREDICTION_MODEL_METADATA } from '../../mock/predictionData';
import { Layers, Cpu, Server, Database, ArrowRight, Sparkles, CheckCircle2, ShieldAlert, Code } from 'lucide-react';

export const ModelReadinessPage = () => {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>Engineering Transparency & AI Roadmap • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Prediction Engine Model Readiness
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Architectural blueprint detailing current Phase 9 deterministic baseline rules and future microservices ML model replacement roadmap.
        </p>
      </div>

      {/* Current Phase Engine Card */}
      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-600" />
          <span>Active Phase 9 Engine Status: <strong>{PREDICTION_MODEL_METADATA.modelType}</strong></span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          The current Phase 9 engine operates deterministically on the frontend using active operational data from BuildOps hooks.
          All formulas are transparent, explainable, and fully decoupled so they can be replaced by backend ML microservices in a future phase without modifying UI components.
        </p>
      </div>

      {/* Target Microservices Architecture Diagram */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="font-black text-base text-white tracking-tight">
              Target Machine Learning Pipeline Architecture
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 px-2.5 py-1 bg-slate-800 rounded font-bold uppercase">
            Future Phase Target Architecture
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 items-center text-center text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 text-amber-300 font-bold">
            <Code className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            BuildOps Frontend
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block mx-auto" />

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-bold">
            <Server className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            Spring Boot API Gateway
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block mx-auto" />

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-bold">
            <Layers className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            Prediction Orchestrator Service
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block mx-auto" />

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-bold">
            <Cpu className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            Python ML Service (FastAPI / XGBoost)
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center italic pt-2">
          Modular frontend design guarantees zero UI redesign when transitioning from baseline rule calculation to microservices Python ML endpoints.
        </p>
      </div>

      {/* Future Model Candidates List */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Future ML Model Candidate Specifications</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FUTURE_MODEL_CANDIDATES.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-amber-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">
                    {model.id} • {model.status}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{model.name}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  {model.type}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900">Model Target:</strong> {model.target}
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">Input Feature Set:</strong>
                  <div className="flex flex-wrap gap-1">
                    {model.inputFeatures.map((feat, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-emerald-700 font-medium">
                  <strong>Expected Impact:</strong> {model.benefits}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
