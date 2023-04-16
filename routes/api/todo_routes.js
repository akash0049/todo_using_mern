const express = require('express');
const { createTodo, getTodo, getUserTodos, updateTodo, deleteTodo } = require('../../controllers/todo.js');
const { isAuthorized } = require('../../validators/auth.js');

const todoRouter = express.Router();

todoRouter.post('/create-todo', isAuthorized, createTodo);

todoRouter.get('/get-user-todos/:userId', getUserTodos);

todoRouter.get('/get-todo/:id', isAuthorized, getTodo);

todoRouter.put('/update-todo/:id', isAuthorized, updateTodo);

todoRouter.delete('/delete-todo/:id', isAuthorized, deleteTodo); 4

module.exports = todoRouter;