const db = require('../config');
exports.createUser = (name, email, hash, cb) => {
  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], cb
  );
};
exports.findByEmail = (email, cb) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], cb);
};
exports.findById = (id, cb) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], cb);
};
