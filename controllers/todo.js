const Todo = require("../models/todo.js");
const client = require("../redis_service/redis_config.js");

const createTodo = async (req, res) => {
    try {
        const { title, userId, validDate } = req.body;
        const todo = Todo({
            title: title,
            userId: userId,
            validDate: validDate
        });
        await todo.save();

        const todos = await client.get('todos');
        if (!todos) {
            let todos_array = [todo];
            await client.set('todos', JSON.stringify(todos_array))
        } else {
            let todos_array = JSON.parse(todos);
            todos_array.push(todo);
            await client.set('todos', JSON.stringify(todos_array))
        }


        res.status(201).send({ message: "Todo Created" });
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error!!!')
    }
}
const getTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todos = await client.get('todos');
        let todo;

        if (todos) {
            let todos_array = JSON.parse(todos);
            for (const i of todos_array) {
                if (i['_id'] === id) {
                    todo = i
                }
            }
        } else {
            todo = await Todo.findById(id);
        }
        if (!todo) {
            res.status(404).send('Todo not found');
        }
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send('Server Error!!!')
    }
}
const getUserTodos = async (req, res) => {
    try {

        const { userId } = req.params;
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const skipFrom = (page - 1) * limit
        const todos = await client.get('todos');
        let user_todos = [];

        if (todos) {
            let todos_array = JSON.parse(todos);
            for (const i of todos_array) {
                if (i['userId'] === userId) {
                    user_todos.push(i);
                }
            }
            user_todos = user_todos.slice(skipFrom, skipFrom + limit)
        } else {
            user_todos = await Todo.find({ userId: userId }).limit(limit).skip(skipFrom).exec();
        }
        if (!user_todos) {
            res.status(404).send('No todo created yet');
        }
        res.status(200).send(user_todos);
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error!!!')
    }
}
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, validDate } = req.body;
        await Todo.findByIdAndUpdate(id, {
            title: title, validDate: validDate
        });
        const todos = await client.get('todos');
        let todos_array = JSON.parse(todos);

        let index = todos_array.map(i => i['_id']).indexOf(id);
        todos_array[index].title = title || todos_array[index].title;
        todos_array[index].validDate = title || todos_array[index].validDate;

        await client.set('todos', JSON.stringify(todos_array));

        res.status(200).send({ message: "Todo Updated" });
    } catch (error) {
        res.status(500).send('Server Error!!!')
    }
}
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);

        const todos = await client.get('todos');
        let todos_array = JSON.parse(todos);

        let index = todos_array.map(i => i['_id']).indexOf(id);
        todos_array.splice(index, 1);

        await client.set('todos', JSON.stringify(todos_array));

        res.status(200).send({ message: "Todo Deleted" });
    } catch (error) {
        res.status(500).send('Server Error!!!')
    }
}


module.exports = { createTodo, getTodo, getUserTodos, updateTodo, deleteTodo };