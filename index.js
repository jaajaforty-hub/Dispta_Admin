import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
    res.sendFile("dashbord.html", { root: "public" });
});



app.get("/api/data", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM carriers");
        res.json(result.rows);   // send ONLY the array
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});




app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});



