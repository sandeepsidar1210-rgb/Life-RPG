import React from 'react';
import { useScholar } from '../../context/ScholarContext.jsx';
import { QuestList } from '../QuestList.jsx';

export function QuestsPage() {
  const {
    quests,
    handleCompleteQuest,
    handleCreateQuest,
    handleEditQuest,
    handleDeleteQuest,
    completingId
  } = useScholar();

  return (
    <div className="space-y-4">
      <QuestList
        quests={quests}
        onComplete={handleCompleteQuest}
        onCreate={handleCreateQuest}
        onEdit={handleEditQuest}
        onDelete={handleDeleteQuest}
        completingId={completingId}
      />
    </div>
  );
}
