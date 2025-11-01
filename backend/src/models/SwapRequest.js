const db = require('../config');

exports.createRequest = (req) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO swap_requests (requesterId, requesteeId, requesterEventId, requesteeEventId, status) VALUES (?, ?, ?, ?, "PENDING")',
      [req.requesterId, req.requesteeId, req.requesterEventId, req.requesteeEventId],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

exports.getIncoming = (userId, cb) => {
  db.all(
    `SELECT sr.*, 
     u1.name as requesterName, 
     e1.title as requesterEventTitle, 
     e1.startTime as requesterStartTime,
     e1.endTime as requesterEndTime,
     e2.title as requesteeEventTitle, 
     e2.startTime as requesteeStartTime,
     e2.endTime as requesteeEndTime
     FROM swap_requests sr
     JOIN users u1 ON sr.requesterId = u1.id
     JOIN events e1 ON sr.requesterEventId = e1.id
     JOIN events e2 ON sr.requesteeEventId = e2.id
     WHERE sr.requesteeId = ?
     ORDER BY sr.id DESC`,
    [userId],
    cb
  );
};

exports.getOutgoing = (userId, cb) => {
  db.all(
    `SELECT sr.*, 
     u2.name as requesteeName,
     e1.title as requesterEventTitle, 
     e1.startTime as requesterStartTime,
     e1.endTime as requesterEndTime,
     e2.title as requesteeEventTitle, 
     e2.startTime as requesteeStartTime,
     e2.endTime as requesteeEndTime
     FROM swap_requests sr
     JOIN users u2 ON sr.requesteeId = u2.id
     JOIN events e1 ON sr.requesterEventId = e1.id
     JOIN events e2 ON sr.requesteeEventId = e2.id
     WHERE sr.requesterId = ?
     ORDER BY sr.id DESC`,
    [userId],
    cb
  );
};

exports.getById = (id, cb) => {
  db.get('SELECT * FROM swap_requests WHERE id = ?', [id], cb);
};

exports.updateStatus = (id, status, cb) => {
  db.run('UPDATE swap_requests SET status = ? WHERE id = ?', [status, id], cb);
};

