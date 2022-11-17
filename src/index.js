const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user){
    return response.status(404).json({
      error: 'Mensagem do erro'
    });
  }

  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  });

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  user.todos.forEach(todo => {
    if(todo.id == id){
      todo.title = title;
      todo.deadline = deadline;
    }
  });

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { done } = request.body;

  user.todos.forEach(todo => {
    if(todo.id == id){
      todo.done = done;
    }
  });

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  user.todos = user.todos.filter(item => item.id != id);

  console.log(user.todos);
  return response.status(200).send();
});

module.exports = app;