const express = require('express');
const router = express.Router();
const { event, swap, user } = require('../models');
const auth = require('../middleware/auth');

router.post('/request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  event.getById(mySlotId, (err, myEvent) => {
    event.getById(theirSlotId, (err, theirEvent) => {
      if (!myEvent || !theirEvent || myEvent.userId != req.user.id || myEvent.status != 'SWAPPABLE' || theirEvent.status != 'SWAPPABLE')
        return res.status(400).send();
      event.updateStatus(mySlotId, 'SWAPPENDING', () => {
        event.updateStatus(theirSlotId, 'SWAPPENDING', () => {
          swap.createRequest({
            requesterId: req.user.id,
            requesteeId: theirEvent.userId,
            requesterEventId: mySlotId,
            requesteeEventId: theirSlotId
          }).then(id => {
            swap.getById(id, (err, sreq) => res.json(sreq));
          });
        });
      });
    });
  });
});

router.get('/incoming', auth, (req, res) => {
  swap.getIncoming(req.user.id, (err, reqs) => res.json(reqs));
});
router.get('/outgoing', auth, (req, res) => {
  swap.getOutgoing(req.user.id, (err, reqs) => res.json(reqs));
});

router.post('/response/:id', auth, (req, res) => {
  const accept = req.body.accept;
  swap.getById(req.params.id, (err, sr) => {
    if (!sr || sr.requesteeId != req.user.id || sr.status != 'PENDING')
      return res.status(404).send();
    if (accept) {
      event.setOwner(sr.requesteeEventId, sr.requesterId, () => {
        event.setOwner(sr.requesterEventId, sr.requesteeId, () => {
          event.updateStatus(sr.requesteeEventId, 'BUSY', () => {
            event.updateStatus(sr.requesterEventId, 'BUSY', () => {
              swap.updateStatus(sr.id, 'ACCEPTED', () => res.json({ success: true }));
            });
          });
        });
      });
    } else {
      event.updateStatus(sr.requesteeEventId, 'SWAPPABLE', () => {
        event.updateStatus(sr.requesterEventId, 'SWAPPABLE', () => {
          swap.updateStatus(sr.id, 'REJECTED', () => res.json({ success: true }));
        });
      });
    }
  });
});

module.exports = router;
