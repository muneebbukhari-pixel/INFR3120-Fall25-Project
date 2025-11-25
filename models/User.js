const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, "../data/users.json");

// Ensure users file exists
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

module.exports = {
  findByEmail(email) {
    const users = JSON.parse(fs.readFileSync(usersFile));
    return users.find(u => u.email === email);
  },

  async create(username, email, password) {
    const users = JSON.parse(fs.readFileSync(usersFile));

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashed
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return newUser;
  },

  async validate(email, password) {
    const user = this.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
};