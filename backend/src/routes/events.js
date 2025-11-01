const express = require('express');
const router = express.Router();
const { event } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  event.getUserEvents(req.user.id, (err, events) => {
    res.json(events);
  });
});

router.post('/', auth, (req, res) => {
  const { title, startTime, endTime } = req.body;
  event.createEvent(title, startTime, endTime, req.user.id, function (err) {
    if (err) return res.status(400).send();
    event.getUserEvents(req.user.id, (err, events) => {
      res.json(events[events.length-1]);
    });
  });
});

router.put('/swappable/:id', auth, (req, res) => {
  event.updateStatus(req.params.id, 'SWAPPABLE', (err) => {
    res.json({ success: true });
  });
});

router.get('/swappable', auth, (req, res) => {
  event.getSwappableForOthers(req.user.id, (err, events) => {
    res.json(events);
  });
});

module.exports = router;
