import { IHabitTrackerDatabase } from './database-interface';
import { HabitTrackerSQLiteDatabase } from './database-sqlite';
import { HabitTrackerPostgresDatabase } from './database-postgres';

export async function createDatabase(): Promise<IHabitTrackerDatabase> {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const neonDbUrl = process.env.NEON_DATABASE_URL;

  let database: IHabitTrackerDatabase;

  if (isDevelopment || !neonDbUrl) {
    console.log('Using SQLite database for habit tracker');
    database = new HabitTrackerSQLiteDatabase();
  } else {
    console.log('Using PostgreSQL (Neon DB) for habit tracker');
    database = new HabitTrackerPostgresDatabase(neonDbUrl);
  }

  await database.initialize();
  return database;
}