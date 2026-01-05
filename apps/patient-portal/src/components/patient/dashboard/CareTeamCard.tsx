'use client';

import React from 'react';
import { MedicalAdvisorWidget } from '../MedicalAdvisorWidget';

/**
 * CareTeamCard component
 * 
 * In Slice 02B, this component serves as the host for the Medical Advisor Agent integration.
 * This replaces the previous mock/placeholder.
 */
export const CareTeamCard = () => {
  return (
    <div className="space-y-6">
      {/* Medical Advisor Agent Integration (Step 4.4) */}
      <MedicalAdvisorWidget />
      
      {/* 
        Future: Real Care Team member list integration would go here.
        Currently focused on Step 4.4: Medical Advisor Agent Advisory Integration.
      */}
    </div>
  );
};
