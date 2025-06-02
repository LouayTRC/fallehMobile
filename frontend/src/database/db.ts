import SQLite from 'react-native-sqlite-storage';

// Enable verbose debugging
SQLite.enablePromise(true);
SQLite.DEBUG(true);

const databaseConfig = {
  name: 'database.db',
  location: 'default',
  // createFromLocation: 1, // Only uncomment if you have prepopulated DB
};

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    console.log('Attempting to open database...');
    
    if (!databaseInstance) {
      databaseInstance = await SQLite.openDatabase(databaseConfig);
      console.log('Database opened successfully');
      
      await databaseInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS Transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('Falleh', 'Base')),
          kilos REAL,
          boxes INTEGER,
          kgf REAL,
          litres REAL,
          prixBase REAL,
          price REAL NOT NULL DEFAULT 0,
          paid BOOLEAN NOT NULL DEFAULT 0,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tables created successfully');
    }
    
    return databaseInstance;
  } catch (error) {
    console.error('Database initialization failed:', error);
    // Reset instance on failure
    databaseInstance = null;
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!databaseInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return databaseInstance;
};