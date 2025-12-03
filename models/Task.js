const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

function readTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

function getAllTasks() {
  return readTasks();
}

function addTask(data) {
  const tasks = readTasks();

  const newTask = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    dueDate: data.dueDate
  };

  tasks.push(newTask);
  writeTasks(tasks);
}

function getTask(id) {
  const tasks = readTasks();
  return tasks.find(t => t.id === id);
}

function updateTask(id, data) {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index !== -1) {
    tasks[index].title = data.title;
    tasks[index].description = data.description;
    tasks[index].dueDate = data.dueDate;
    writeTasks(tasks);
  }
}

function deleteTask(id) {
  let tasks = readTasks();
  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);
}

module.exports = {
  getAllTasks,
  addTask,
  getTask,
  updateTask,
  deleteTask
};
