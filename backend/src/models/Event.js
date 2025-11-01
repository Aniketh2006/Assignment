const db = require('../config');
exports.createEvent = (title, start, end, userId, cb) => {
  db.run(
    "INSERT INTO events (title, startTime, endTime, status, userId) VALUES (?, ?, ?, 'BUSY', ?)",
    [title, start, end, userId], cb
  );
};
exports.getUserEvents = (userId, cb) => {
  db.all('SELECT * FROM events WHERE userId = ?', [userId], cb);
};
exports.updateStatus = (id, status, cb) => {
  db.run('UPDATE events SET status = ? WHERE id = ?', [status, id], cb);
};
exports.setOwner = (id, userId, cb) => {
  db.run('UPDATE events SET userId = ? WHERE id = ?', [userId, id], cb);
};
exports.getSwappableForOthers = (userId, cb) => {
  db.all('SELECT * FROM events WHERE status = "SWAPPABLE" AND userId != ?', [userId], cb);
};
exports.getById = (id, cb) => {
  db.get('SELECT * FROM events WHERE id = ?', [id], cb);
};
