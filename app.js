const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const dataPath = "./data/tasks.json";

function getTasks() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
}

app.get("/", (req, res) => {
  const tasks = getTasks();
  res.render("index", { tasks });
});

app.get("/add", (req, res) => {
  res.render("addTask");
});

app.post("/add", (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id == req.params.id);
  res.render("editTask", { task });
});

app.post("/edit/:id", (req, res) => {
  let tasks = getTasks();
  tasks = tasks.map(t =>
    t.id == req.params.id
      ? { ...t, title: req.body.title, description: req.body.description, dueDate: req.body.dueDate }
      : t
  );
  saveTasks(tasks);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  let tasks = getTasks().filter(t => t.id != req.params.id);
  saveTasks(tasks);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`TaskFlow running on http://localhost:${PORT}`));