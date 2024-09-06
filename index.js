const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const dbPath = './db.json';

// Helper function to read the DB file
const readDbFile = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to the DB file
const writeDbFile = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// 1. Get all todos
app.get('/todos', (req, res) => {
  const db = readDbFile();
  res.json(db.todos);
});

// 2. Add a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ message: "Task is required" });
  }
  const db = readDbFile();
  const newTodo = {
    id: db.todos.length + 1,
    task,
    status: false
  };
  db.todos.push(newTodo);
  writeDbFile(db);
  res.status(201).json(newTodo);
});

// 3. Update the status of even-ID todos
app.put('/todos/update-even', (req, res) => {
  const db = readDbFile();
  const updatedTodos = db.todos.map(todo => {
    if (todo.id % 2 === 0 && !todo.status) {
      return { ...todo, status: true };
    }
    return todo;
  });

  db.todos = updatedTodos;
  writeDbFile(db);

  res.json({ message: "Updated even ID todos" });
});

// 4. Delete todos with status true
app.delete('/todos/delete-true', (req, res) => {
  const db = readDbFile();
  db.todos = db.todos.filter(todo => todo.status !== true);
  writeDbFile(db);
  res.json({ message: "Deleted todos with status true" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
