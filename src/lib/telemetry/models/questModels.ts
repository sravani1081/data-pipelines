// Quest & Progression Tree Signal Processing

import { BaseGameEvent } from '@/types/telemetry';
import { generateId } from '@/lib/utils/helpers';

export interface QuestObjectiveProgress {
  objectiveId: string;
  objectiveDescription: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
}

export interface DetailedQuestEvent extends BaseGameEvent {
  event_name: 'quest_completed' | 'quest_started';
  questId: string;
  questTitle: string;
  chapterId: string;
  objectives: QuestObjectiveProgress[];
  timeElapsedSeconds: number;
  goldRewarded: number;
  xpRewarded: number;
}

export function createDetailedQuestEvent(index: number): DetailedQuestEvent {
  const isComplete = index % 2 === 0;

  return {
    event_id: generateId('evt_qst_det'),
    event_name: isComplete ? 'quest_completed' : 'quest_started',
    timestamp: new Date(Date.now() - index * 3000).toISOString(),
    player_id: `ply_${1000 + (index % 100)}`,
    session_id: `ses_${8000 + Math.floor(index / 10)}`,
    game_id: 'cyber_nexus_v1',
    platform: 'PlayStation',
    region: 'NA-East',
    app_version: 'v2.4.1',
    questId: `q_main_ch${(index % 5) + 1}_sub${index % 3}`,
    questTitle: `Chapter ${(index % 5) + 1}: The Cyber Assault`,
    chapterId: `ch_${(index % 5) + 1}`,
    objectives: [
      { objectiveId: 'obj_1', objectiveDescription: 'Infiltrate Main Gate', targetCount: 1, currentCount: 1, isCompleted: true },
      { objectiveId: 'obj_2', objectiveDescription: 'Defeat 15 Security Bots', targetCount: 15, currentCount: isComplete ? 15 : 8, isCompleted: isComplete },
    ],
    timeElapsedSeconds: 450 + index * 30,
    goldRewarded: isComplete ? 1200 : 0,
    xpRewarded: isComplete ? 5000 : 0,
  };
}
