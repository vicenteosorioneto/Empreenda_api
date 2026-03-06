const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

const createTables = () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      institution TEXT,
      age INTEGER,
      userType TEXT,
      character TEXT,
      class TEXT,
      schoolId TEXT,
      classCode TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const screenTimeTable = `
    CREATE TABLE IF NOT EXISTS screen_time (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      screenName TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      duration INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `;

  db.serialize(() => {
    db.run(usersTable, (err) => {
      if (err) console.error("Erro ao criar tabela 'users':", err.message);
      else console.log("Tabela 'users' criada ou já existe.");
    });
    db.run(screenTimeTable, (err) => {
      if (err) console.error("Erro ao criar tabela 'screen_time':", err.message);
      else console.log("Tabela 'screen_time' criada ou já existe.");
    });
  });
};

db.on('open', () => {
  createTables();
});

module.exports = db;
