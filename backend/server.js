// backend/server.js
const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("noticias.db");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "segredo_abrhpe",
  resave: false,
  saveUninitialized: true,
}));

// Criação das tabelas
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, senha TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS noticias (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, conteudo TEXT, data TEXT)");
  db.get("SELECT * FROM admin WHERE email = ?", ["admin@abrhpe.com"], (err, row) => {
    if (!row) {
      db.run("INSERT INTO admin (email, senha) VALUES (?, ?)", ["admin@abrhpe.com", "123456"]);
    }
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  db.get("SELECT * FROM admin WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
    if (row) {
      req.session.user = email;
      res.json({ sucesso: true });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  });
});

// Verifica se está logado
app.get("/auth", (req, res) => {
  res.json({ logado: !!req.session.user });
});

// Adicionar notícia
app.post("/noticias", (req, res) => {
  if (!req.session.user) return res.status(401).json({ erro: "Não autorizado" });
  const { titulo, conteudo } = req.body;
  const data = new Date().toISOString().split("T")[0];
  db.run("INSERT INTO noticias (titulo, conteudo, data) VALUES (?, ?, ?)", [titulo, conteudo, data], function(err) {
    if (err) return res.status(500).json({ erro: "Erro ao salvar notícia" });
    res.json({ sucesso: true, id: this.lastID });
  });
});

// Listar notícias
app.get("/noticias", (req, res) => {
  db.all("SELECT * FROM noticias ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar notícias" });
    res.json(rows);
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ sucesso: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
