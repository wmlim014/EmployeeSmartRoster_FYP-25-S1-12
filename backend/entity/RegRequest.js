export const SubmitRegRequest = (app, db) => {
    app.post('/signup', (req, res) => {
        const query = "INSERT INTO REGISTRATION_REQUEST SET ?";
        const values = req.body;
        
        db.query(query, values, (err, result) => {
            if (err) 
                return res.status(500).json({ error: "Database error" });
            res.json({ success: true, id: result.insertId });
        });
    });
};