import express from "express";
import db from "../config/database.js";

const router = express.Router();

// Registrar tempo de tela
router.post("/", (req, res) => {
  const { sessions } = req.body;

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return res.status(400).json({ error: "Dados de sessão inválidos" });
  }

  const sql = `INSERT INTO screen_time (userId, screenName, startTime, endTime, duration) VALUES (?, ?, ?, ?, ?)`;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    sessions.forEach(session => {
      const { userId, screenName, startTime, endTime, duration } = session;
      const params = [userId, screenName, new Date(startTime).toISOString(), new Date(endTime).toISOString(), duration];
      db.run(sql, params, (err) => {
        if (err) {
          console.error("Erro ao inserir sessão de tempo de tela:", err.message);
        }
      });
    });

    db.run("COMMIT", (err) => {
      if (err) {
        console.error("Erro ao commitar transação:", err.message);
        return res.status(500).json({ error: "Erro ao salvar dados de tempo de tela" });
      }
      res.status(201).json({ message: "Dados de tempo de tela salvos com sucesso" });
    });
  });
});

// Obter tempo de tela por usuário (para o dashboard)
router.get("/user/:userId", (req, res) => {
  const sql = "SELECT * FROM screen_time WHERE userId = ? ORDER BY startTime DESC";
  db.all(sql, [req.params.userId], (err, rows) => {
    if (err) {
      console.error("Erro ao obter tempo de tela:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
    res.json(rows);
  });
});

// Obter tempo de tela agregado (para o dashboard)
router.get("/summary", (req, res) => {
  const sql = `
    SELECT 
      u.name, 
      u.institution, 
      u.age,
      s.screenName,
      SUM(s.duration) as totalDuration
    FROM screen_time s
    JOIN users u ON s.userId = u.id
    GROUP BY u.id, s.screenName
    ORDER BY u.name, totalDuration DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro ao obter resumo de tempo de tela:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
    res.json(rows);
  });
});

export default router;
