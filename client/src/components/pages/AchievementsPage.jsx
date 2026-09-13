import React from 'react';
import { useScholar } from '../../context/ScholarContext.jsx';
import { AchievementsGrid } from '../AchievementsGrid.jsx';

export function AchievementsPage() {
  const { freshAchievements } = useScholar();

  return (
    <div className="space-y-4">
      <AchievementsGrid externalAchievements={freshAchievements} />
    </div>
  );
}
