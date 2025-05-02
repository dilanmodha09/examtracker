export interface Exam {
  id: string;
  name: string;
  date: string; // ISO date string
  time: string; // e.g., "14:00-16:00"
  location?: string;
  seatNumber?: string;
  notes?: string;
  completed?: boolean;
}

export interface RevisionSession {
  id: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  subject: string;
  topics: string[];
  notes?: string;
  completed?: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}