const express = require('express');
const subUrganceRouter = express.Router();
const db = require('./db'); 

subUrganceRouter.get('/sub-urgances/:urganceId', (req, res) => {
    const urganceId = req.params.urganceId;
  
    // Perform the necessary database query to fetch the sub-urgances by urgance_id
    const sql = 'SELECT * FROM suburgance WHERE urgance_id = ?';
    db.query(sql, [urganceId], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'No sub-urgances found for the specified urgance_id' });
      } else {
        const subUrgances = result;
        res.json(subUrgances);
      }
    });
  });
  
module.exports = subUrganceRouter;