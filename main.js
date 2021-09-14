const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./sqlite/data.db", (err) => {
    if (err) {
        console.error("database error: " + err.message);
    } else {
    }
});

app.listen(3000, () => {
    console.log("Start server on port 3000.");
});

app.get("/", (req, res) => {
    res.status(200).json({
        "status": "OK",
        "serverName": "LocalServer"
    });
});

app.post("/decks", (req, res) => {
    const reqBody = req.body;
    const stmt = db.prepare("insert into decks(name,base64) values(?,?)"); 
    stmt.run(reqBody.name, reqBody.base64, (err, result) => { 
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "lastID": stmt.lastID
            });
        }
    });
});

app.get("/decks", (req, res) => {
    db.all("select * from decks", [], (err, rows) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "decks": rows
            });
        }
    });
});

app.get("/decks/:id", (req, res) => {
    const id = req.params.id;
    db.get("select * from decks where id = ?", id, (err, row) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "deck": row
            });
        }
    })
})

app.get("/decks/get/:name", (req, res) => {
    const name = req.params.name;
    db.get("select * from decks where name = ?", name, (err, row) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "deck": row
            });
        }
        
    })
})

app.patch("/decks", (req, res) => {
    const reqBody = req.body;
    const stmt = db.prepare("update decks set name = ?, base64 = ? where id = ?");
    stmt.run(reqBody.name, reqBody.base64, reqBody.id, (err, result) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "updatedID": stmt.changes
            });
        }
    })
})

app.delete("/decks/:id", (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare("delete from decks where id = ?");
    stmt.run(id, (err, result) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            res.status(200).json({
                "status": "OK",
                "deletedID": stmt.changes
            });
        }
    })
})