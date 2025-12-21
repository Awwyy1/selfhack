
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

export interface Hack {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasks: Task[];
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  hacksCompleted: number;
  rank: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export enum NavTab {
  DASHBOARD = 'dashboard',
  GOALS = 'goals',
  HACK_ENGINE = 'hack_engine',
  MENTOR = 'mentor',
  INVENTORY = 'inventory'
}
