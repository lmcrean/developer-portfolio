import type { HabitEntry, HabitStats } from './types';

export interface IHabitTrackerDatabase {
  initialize(): Promise<void>;
  upsertEntry(date: string, pullRequestCount: number): Promise<void>;
  getEntry(date: string): Promise<HabitEntry | null>;
  getEntriesByYear(year: number): Promise<HabitEntry[]>;
  getStats(): Promise<HabitStats>;
  close?(): Promise<void>;
}