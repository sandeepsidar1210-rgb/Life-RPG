import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholar } from '../../context/ScholarContext.jsx';
import { SpiritPanel } from '../SpiritPanel.jsx';

export function SpiritPage() {
  const navigate = useNavigate();
  const { spirit, character } = useScholar();

  return (
    <div className="space-y-4">
      <SpiritPanel
        spiritData={spirit}
        userLevel={character.level}
        onNavigateToQuests={() => navigate('/quests')}
      />
    </div>
  );
}
