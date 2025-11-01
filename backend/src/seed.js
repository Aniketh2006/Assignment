const db = require('./config');

console.log('🔄 Creating database tables...');

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)', (err) => {
    if (err) console.error('❌ Error creating users table:', err);
    else console.log('✅ Users table created');
  });

  db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, startTime TEXT, endTime TEXT, status TEXT, userId INTEGER)', (err) => {
    if (err) console.error('❌ Error creating events table:', err);
    else console.log('✅ Events table created');
  });

  db.run('CREATE TABLE IF NOT EXISTS swap_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, requesterId INTEGER, requesteeId INTEGER, requesterEventId INTEGER, requesteeEventId INTEGER, status TEXT)', (err) => {
    if (err) console.error('❌ Error creating swap_requests table:', err);
    else console.log('✅ Swap_requests table created');
  });
});

console.log('✅ Database initialization complete!');
console.log('📁 Database file: database.sqlite');

// DON'T CLOSE THE DATABASE - the app needs it to stay open!
// db.close() <- REMOVED THIS

