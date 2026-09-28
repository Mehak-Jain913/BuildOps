import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_WORKERS,
  INITIAL_CONTRACTORS,
  INITIAL_ATTENDANCE,
  INITIAL_ALLOCATIONS,
  INITIAL_PRODUCTIVITY,
  INITIAL_LABOUR_COSTS,
  INITIAL_LABOUR_ALERTS,
  INITIAL_LABOUR_INTELLIGENCE,
} from '../mock/labourData';

const LabourContext = createContext({
  workers: [],
  contractors: [],
  attendance: [],
  allocations: [],
  productivity: [],
  costs: {},
  alerts: [],
  intelligence: [],
  getWorkerById: () => null,
  addWorker: () => ({ success: false }),
  markAttendance: () => ({ success: false }),
  createAllocation: () => ({ success: false }),
  updateAllocation: () => {},
});

export const LabourProvider = ({ children }) => {
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [contractors] = useState(INITIAL_CONTRACTORS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [productivity] = useState(INITIAL_PRODUCTIVITY);
  const [costs] = useState(INITIAL_LABOUR_COSTS);
  const [alerts] = useState(INITIAL_LABOUR_ALERTS);
  const [intelligence] = useState(INITIAL_LABOUR_INTELLIGENCE);

  const getWorkerById = (id) => {
    return workers.find((w) => w.id === id || w.employeeCode === id) || workers[0] || null;
  };

  // 1. ADD WORKER
  const addWorker = (data) => {
    const nextCode = `WRK-${1000 + workers.length + 1}`;
    const contractorObj = contractors.find((c) => c.id === data.contractorId) || contractors[0];

    const newWorker = {
      id: nextCode,
      employeeCode: data.employeeCode || nextCode,
      name: data.name,
      phone: data.phone || '+91 98765-00000',
      trade: data.trade || 'Mason',
      skillLevel: data.skillLevel || 'Skilled',
      contractorId: data.contractorId || contractorObj.id,
      contractorName: contractorObj.name,
      projectId: data.projectId || 'PRJ-001',
      projectName: data.projectName || 'Sunrise Heights',
      status: data.status || 'Active',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      dailyRate: parseFloat(data.dailyRate) || 850,
      overtimeRate: parseFloat(data.overtimeRate) || 140,
      emergencyContact: data.emergencyContact || '+91 98765-99999',
    };

    setWorkers((prev) => [newWorker, ...prev]);

    return { success: true, worker: newWorker };
  };

  // 2. MARK ATTENDANCE
  const markAttendance = (data) => {
    const workerObj = workers.find((w) => w.id === data.workerId) || workers[0];

    const existingIdx = attendance.findIndex(
      (a) => a.workerId === data.workerId && a.date === data.date
    );

    const checkIn = data.checkIn || '08:00 AM';
    const checkOut = data.checkOut || '05:00 PM';
    const workingHours = data.status === 'Present' ? parseFloat(data.workingHours || 8.0) : 0;
    const overtime = data.status === 'Present' ? Math.max(0, workingHours - 8.0) : 0;

    const newEntry = {
      id: `ATT-${Date.now()}`,
      date: data.date || new Date().toISOString().split('T')[0],
      workerId: data.workerId,
      workerName: workerObj.name,
      trade: workerObj.trade,
      projectId: data.projectId || workerObj.projectId,
      projectName: data.projectName || workerObj.projectName,
      blockName: data.blockName || 'Block A',
      levelName: data.levelName || 'Level 1',
      status: data.status || 'Present',
      checkIn: data.status === 'Present' ? checkIn : '—',
      checkOut: data.status === 'Present' ? checkOut : '—',
      workingHours: Math.round(workingHours * 10) / 10,
      overtime: Math.round(overtime * 10) / 10,
    };

    if (existingIdx >= 0) {
      setAttendance((prev) =>
        prev.map((a, idx) => (idx === existingIdx ? newEntry : a))
      );
    } else {
      setAttendance((prev) => [newEntry, ...prev]);
    }

    return { success: true, entry: newEntry };
  };

  // 3. CREATE WORKFORCE ALLOCATION (With Overlap Validation)
  const createAllocation = (data) => {
    // Overlap conflict check: check if an allocation for the same trade/block/level/shift exists
    const hasConflict = allocations.some(
      (a) =>
        a.projectId === data.projectId &&
        a.blockId === data.blockId &&
        a.levelId === data.levelId &&
        a.shift === data.shift &&
        a.trade === data.trade &&
        a.status === 'Active'
    );

    if (hasConflict) {
      return {
        success: false,
        error: `Worker or trade allocation for ${data.trade} on ${data.shift} shift is already assigned to this location/time period.`,
      };
    }

    const newAllocation = {
      id: `ALC-${Date.now()}`,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Block A',
      levelId: data.levelId || '',
      levelName: data.levelName || 'Level 1',
      taskId: data.taskId || '',
      taskName: data.taskName || 'Site Activity',
      trade: data.trade || 'Mason',
      allocatedCount: parseInt(data.allocatedCount) || 5,
      requiredCount: parseInt(data.requiredCount) || 5,
      shift: data.shift || 'General',
      supervisor: data.supervisor || 'David Miller',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    setAllocations((prev) => [newAllocation, ...prev]);

    return { success: true, allocation: newAllocation };
  };

  const updateAllocation = (id, updatedFields) => {
    setAllocations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  return (
    <LabourContext.Provider
      value={{
        workers,
        contractors,
        attendance,
        allocations,
        productivity,
        costs,
        alerts,
        intelligence,
        getWorkerById,
        addWorker,
        markAttendance,
        createAllocation,
        updateAllocation,
      }}
    >
      {children}
    </LabourContext.Provider>
  );
};

export const useLabour = () => useContext(LabourContext);
