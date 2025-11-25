const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, "../data/tasks.json");

module.exports = {
  getAll() {
    return JSON.parse(fs.readFileSync(tasksFile));
  },

  saveAll(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  },

  addTask(task) {
    const tasks = this.getAll();
    task.id = Date.now().toString();
    tasks.push(task);
    this.saveAll(tasks);
  },

  getTask(id) {
    return this.getAll().find(t => t.id === id);
  },

  updateTask(id, updated) {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === id);

    tasks[index] = { id, ...updated };
    this.saveAll(tasks);
  },

  deleteTask(id) {
    let tasks = this.getAll();
    tasks = tasks.filter(t => t.id !== id);
    this.saveAll(tasks);
  }
};