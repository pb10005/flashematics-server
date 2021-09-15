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
    db.get("select * from decks where name = ?", reqBody.name, (err, row) => {
        if (err) {
            res.status(400).json({
                "status": "error",
                "message": err.message
            });
            return;
        } else {
            if(!row) {
                // insert if the row not exists
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
            } else {
                // update if the row exists
                const stmt = db.prepare("update decks set base64 = ? where name = ?");
                stmt.run(reqBody.base64, reqBody.name, (err, result) => {
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
            }
        }
    })
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

app.delete("/decks/:name", (req, res) => {
    const name = req.params.name;
    const stmt = db.prepare("delete from decks where name = ?");
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