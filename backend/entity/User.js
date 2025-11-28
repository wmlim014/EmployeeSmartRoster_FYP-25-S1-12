import bcrypt from "bcrypt";

export const SubmitLogin = async (app, db) => {
    app.post('/login', (req, res) => {
        // console.log(req)
        const query = "SELECT * FROM user WHERE `email` = ?";
        
        db.query(query, [req.body.email], async (err, data) => {
            if(err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database operation failed" });
            }
            
            if(data.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Compare input password and hashed passwords
            const isValid = await bcrypt.compare(req.body.password, data[0].password_hash);
            
            if(isValid) {
                // Update login status and last login time
                const updateQuery = `
                    UPDATE user 
                    SET is_loggedIn = TRUE, 
                        last_login = CURRENT_TIMESTAMP 
                    WHERE email = ?
                `;
                
                db.query(updateQuery, [req.body.email], (updateErr) => {
                    if(updateErr) {
                        console.error("Login status update failed:", updateErr);
                        return res.status(500).json({ error: "Login status update failed" });
                    }
                    
                    return res.json({
                        success: true,
                        user: {
                            email: data[0].email,
                            role: data[0].role,
                            // last_login: new Date().toISOString()
                        }
                    });
                });
            }
        });
    })
}

export const GetUser = (req, res) => {
    const userId = req.params.id;
  
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error(err);
        // FIX: Add 'return' to prevent further execution
        return res.status(500).json({ error: "Database error" });
      }
  
      if (results.length === 0) {
        // FIX: Add 'return' here too
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(results[0]);
    });
  };

export const LogUserOut = (app, db) => {
    app.post('/logout', (req, res) => {
      const { email } = req.body;
      console.log(req)
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      const query = `
        UPDATE user 
        SET is_loggedIn = FALSE
        WHERE email = ?
      `;
  
      db.query(query, [email], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database operation failed" });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        
        res.clearCookie("sessionId");
        res.json({ success: true });
      });
    });
};