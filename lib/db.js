import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Enable verbose logging for SQLite
sqlite3.verbose();

// Keep a single connection for demo purposes
let db = null;

// Demo users - will be added when DB is initialized
const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrator' },
  { username: 'demo', password: 'demo123', name: 'Demo User' },
  { username: 'student', password: 'student123', name: 'Test Student' }
];

export async function getDb() {
  try {
    if (!db) {
      console.log('Creating new database connection...');
      db = await open({
        filename: ':memory:',  // Still in-memory but now shared across requests
        driver: sqlite3.Database
      });
      console.log('Database connection created');

      // Initialize schema
      console.log('Creating users table...');
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE,
          password TEXT,
          name TEXT
        )
      `);
      console.log('Users table created');

      // Add demo users if table is empty
      const count = await db.get('SELECT COUNT(*) as count FROM users');
      console.log('Current user count:', count.count);
      
      if (count.count === 0) {
        console.log('Adding demo users...');
        for (const user of DEMO_USERS) {
          // Still using unsafe concatenation for demo
          const sql = "INSERT INTO users (username, password, name) VALUES ('" +
            user.username + "', '" + user.password + "', '" + user.name + "')";
          console.log('Executing SQL:', sql);
          await db.exec(sql);
        }
        console.log('Demo users added');
      }
    }
    return db;
  } catch (error) {
    console.error('Database error:', error);
    db = null; // Reset connection on error
    throw error;
  }
}