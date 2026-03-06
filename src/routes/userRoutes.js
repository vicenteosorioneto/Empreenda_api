
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/database.js");

const router = express.Router();

// Criar novo usuário
router.post("/", async (req, res) => {
  const { name, email, password, institution, age, userType, character, class: userClass, schoolId, classCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (name, email, password, institution, age, userType, character, class, schoolId, classCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, email, hashedPassword, institution, age, userType, character, userClass, schoolId, classCode];

    db.run(sql, params, function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "Email já cadastrado" });
        }
        console.error("Erro ao criar usuário:", err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      res.status(201).json({ id: this.lastID, name, email });
    });
  } catch (error) {
    console.error("Erro ao hashear senha:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Obter todos os usuários (para o dashboard)
router.get("/", (req, res) => {
  const sql = "SELECT id, name, email, institution, age, userType, character, class, schoolId, classCode, xp, level, createdAt FROM users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro ao obter usuários:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
    res.json(rows);
  });
});

// Obter um usuário específico
router.get("/:id", (req, res) => {
  const sql = "SELECT id, name, email, institution, age, userType, character, class, schoolId, classCode, xp, level, createdAt FROM users WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error("Erro ao obter usuário:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
    if (!row) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(row);
  });
});

module.exports = router;
