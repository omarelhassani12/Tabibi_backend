require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const db = require('./db'); 
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

usersRouter.get('/patients', (req, res) => {
    // Create a SQL query to fetch user data with role = 'Patient' from the database
    const sqlQuery = 'SELECT * FROM users WHERE role = "Patient"';
  
    // Call the database to execute the query
    db.query(sqlQuery, (error, results) => {
      if (error) {
        // If there was an error retrieving the user data, send an error response
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // If the query was successful, send the user data as the response
        res.json({ success: true, users: results });
      }
    });
  });

  
usersRouter.get('/doctors', (req, res) => {
    // Create a SQL query to fetch user data with role = 'Doctor' from the database
    const sqlQuery = 'SELECT * FROM users WHERE role = "doctor"';
  
    // Call the database to execute the query
    db.query(sqlQuery, (error, results) => {
      if (error) {
        // If there was an error retrieving the user data, send an error response
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // If the query was successful, send the user data as the response
        res.json({ success: true, users: results });
      }
    });
  });
  
  usersRouter.get('/GetUserData/:userid', async (req, res) => {
    try {
      const id = req.params.userid;
  
      // Execute the MySQL query to fetch user data based on doctorid
      const query = 'SELECT * FROM users WHERE id = ?';
      db.query(query, [id], (error, results) => {
        if (error) {
          // Handle any errors that occur during the query execution
          console.error('MySQL error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.length > 0) {
          // If user data is found, return it as a JSON response
          res.json(results[0]);
        } else {
          // If user data is not found, return a 404 status
          res.status(404).json({ error: 'User not found' });
        }
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Update user profile route

// Configure multer storage
const storage = multer.diskStorage({});

// Configure multer upload options
const upload = multer({ storage });

usersRouter.put('/editprofile/:userId', upload.single('imageProfil'), async (req, res) => {
  const { userId } = req.params;
  const {
    oldPassword,
    newPassword,
    username,
    email,
    cni,
    phone,
    urgence,
    sexe,
    age,
    speciality,
  } = req.body;

  const checkPasswordQuery = 'SELECT * FROM users WHERE id = ?';
  db.query(checkPasswordQuery, [userId], (error, results) => {
    if (error) {
      console.error('Error checking old password:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    bcrypt.compare(oldPassword, user.password, (bcryptError, isMatch) => {
      if (bcryptError) {
        console.error('Error comparing passwords:', bcryptError);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid old password' });
      }

      const updateValues = [];
      const updateFields = [];

      if (username) {
        updateFields.push('username = ?');
        updateValues.push(username);
      }
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (cni) {
        updateFields.push('cni = ?');
        updateValues.push(cni);
      }
      if (phone) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (urgence) {
        updateFields.push('urgence = ?');
        updateValues.push(urgence);
      }
      if (sexe) {
        updateFields.push('sexe = ?');
        updateValues.push(sexe);
      }
      if (age) {
        updateFields.push('age = ?');
        updateValues.push(age);
      }
      if (speciality) {
        updateFields.push('speciality = ?');
        updateValues.push(speciality);
      }
      if (newPassword) {
        // Generate a hash of the new password
        bcrypt.hash(newPassword, 10, (hashError, hashedPassword) => {
          if (hashError) {
            console.error('Error hashing new password:', hashError);
            return res.status(500).json({ message: 'Server error' });
          }
          updateFields.push('password = ?');
          updateValues.push(hashedPassword);

          // Update the user profile data
          let updateUserQuery = '';
          if (updateFields.length > 0) {
            updateUserQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
          } else {
            // No fields to update
            return res.status(400).json({ message: 'No fields to update' });
          }
          const updateUserValues = [...updateValues, userId];

          db.query(updateUserQuery, updateUserValues, async (error, results) => {
            if (error) {
              console.error('Error updating user profile data:', error);
              return res.sendStatus(500);
            }

            // Profile data updated successfully

            if (req.file) {
              try {
                const image = await cloudinary.uploader.upload(req.file.path);

                // Store the Cloudinary image URL in the database
                const updateImageQuery = 'UPDATE users SET avatar = ? WHERE id = ?';
                const updateImageValues = [image.secure_url, userId];

                db.query(updateImageQuery, updateImageValues, (error, results) => {
                  if (error) {
                    console.error('Error updating user profile image:', error);
                    return res.sendStatus(500);
                  }

                  // Image upload and URL update successful
                  return res.sendStatus(200);
                });
              } catch (error) {
                console.error('Error uploading profile image to Cloudinary:', error);
                return res.sendStatus(500);
              }
            } else {
              // No image uploaded, only update profile data
              return res.sendStatus(200);
            }
          });
        });
      } else {
        // Update the user profile data without updating the password
        let updateUserQuery = '';
        if (updateFields.length > 0) {
          updateUserQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        } else {
          // No fields to update
          return res.status(400).json({ message: 'No fields to update' });
        }
        const updateUserValues = [...updateValues, userId];

        db.query(updateUserQuery, updateUserValues, async (error, results) => {
          if (error) {
            console.error('Error updating user profile data:', error);
            return res.sendStatus(500);
          }

          // Profile data updated successfully

          if (req.file) {
            try {
              const image = await cloudinary.uploader.upload(req.file.path);

              // Store the Cloudinary image URL in the database
              const updateImageQuery = 'UPDATE users SET avatar = ? WHERE id = ?';
              const updateImageValues = [image.secure_url, userId];

              db.query(updateImageQuery, updateImageValues, (error, results) => {
                if (error) {
                  console.error('Error updating user profile image:', error);
                  return res.sendStatus(500);
                }

                // Image upload and URL update successful
                return res.sendStatus(200);
              });
            } catch (error) {
              console.error('Error uploading profile image to Cloudinary:', error);
              return res.sendStatus(500);
            }
          } else {
            // No image uploaded, only update profile data
            return res.sendStatus(200);
          }
        });
      }
    });
  });
});






// Define the route for inserting patient history
usersRouter.post('/patient-history', (req, res) => {
  const { userId, urganceId, timestamp } = req.body;

  // Define the SQL query to insert the patient history				

  const query = 'INSERT INTO patient_historique (patient_id, urgence_id, view_date) VALUES (?, ?, ?)';

  // Execdute the query with the provided data
  db.query(query, [userId, urganceId, timestamp], (error, results) => {
    if (error) {
      console.error('Error inserting patient history:', error);
      res.status(500).json({ message: 'Error inserting patient history' });
    } else {
      res.status(200).json({ message: 'Patient history inserted successfully' });
    }
  });
});







module.exports = usersRouter;