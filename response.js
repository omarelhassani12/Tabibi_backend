const express = require('express');
const responseRouter = express.Router();
const db = require('./db');

responseRouter.get('/response/:suburganceid', (req, res) => {
    const suburganceid = req.params.suburganceid;
  
    // Perform the necessary database query to fetch the response by suburganceid
    const sql = 'SELECT * FROM response WHERE suburganceid = ?';
    db.query(sql, [suburganceid], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'No response found for the specified suburganceid' });
      } else {
        const responseData = result.map(response => ({
          id: response.id,
          title: response.title,
          description: response.description,
          image_title: response.image_title,
          suburganceid: response.suburganceid,
          created_at: response.created_at,
          desc_image: response.desc_image
        }));
  
        res.json(responseData);
      }
    });
});

module.exports = responseRouter;




// const express = require('express');
// const responseRouter = express.Router();
// const db = require('./db'); 

// responseRouter.get('/response/:urganceId', (req, res) => {
//     const urganceId = req.params.urganceId;
  
//     // Perform the necessary database query to fetch the response by urgance_id
//     const sql = 'SELECT * FROM response WHERE suburganceid = ?';
//     db.query(sql, [urganceId], (err, result) => {
//       if (err) {
//         res.status(500).json({ error: 'Internal server error' });
//       } else if (result.length === 0) {
//         res.status(404).json({ error: 'No response found for the specified urgance_id' });
//       } else {
//         const subUrgances = result;
//         res.json(subUrgances);
//       }
//     });
//   });
  
// module.exports = responseRouter;