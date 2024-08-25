//Assignment 2 : Filesystem ased todo list
// Create a cli that lets user 
//1. Add a todo
//2. Delete a todo
//3. Mark todo as done

//Store all data in files (todos.json)
// node index.js add "Go to gym" 05:00

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
const todofile = path.join(__dirname, 'todos.json');

// Helper function to read todos from file
async function readTodos() {
    try {
        if (fs.existsSync(todofile)) {
            const data = fs.readFileSync(todofile, 'utf-8');
            try {
                return JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return [];
            }
        } else {
            return [];
        }
    } catch (err) {
        console.error('Error reading todos:', err);
        return [];
    }
}

async function writeTodos(todos) {
    try {
        const jsonString = JSON.stringify(todos, null, 2);
        fs.writeFileSync(todofile, jsonString, 'utf-8');
    } catch (err) {
        console.error('Error writing todos:', err);
    }
}

program
    .name('Listly')
    .description("A CLI-based TODO list app: effortlessly manage your tasks with simple commands to add, delete, and mark items as done.")
    .version('1.0.0');

program.command('add')
    .description('Add a task to your todo list')
    .argument('<task>', 'task to be added')
    .argument('<time>', 'time at which the task is scheduled')
    .action(async (task, time) => {
        try {
            const todos = await readTodos();
            if (!Array.isArray(todos)) {
                throw new Error('Todos data is not an array');
            }
            const id = todos.length ? todos[todos.length - 1].id + 1 : 0;
            const data = {
                id,
                item: task,
                schedule: time,
                done: false
            };
            todos.push(data);
            await writeTodos(todos);
            console.log('Task added successfully');
        } catch (err) {
            console.error('Error adding task:', err);
        }
    });

program.command('delete')
    .description('Delete a task from your todo list')
    .argument('<id>', 'ID of the task to be deleted')
    .action(async (id) => {
        try {
            let todos = await readTodos();
            if (!Array.isArray(todos)) {
                throw new Error('Todos data is not an array');
            }
            todos = todos.filter(todo => todo.id != id);
            await writeTodos(todos);
            console.log('Task deleted successfully');
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    });

program.command('done')
    .description('Mark a task as done')
    .argument('<id>', 'ID of the task to be marked as done')
    .action(async (id) => {
        try {
            const todos = await readTodos();
            if (!Array.isArray(todos)) {
                throw new Error('Todos data is not an array');
            }
            const todo = todos.find(todo => todo.id == id);
            if (todo) {
                todo.done = true;
                await writeTodos(todos);
                console.log('Task marked as done');
            } else {
                console.log('Task not found');
            }
        } catch (err) {
            console.error('Error marking task as done:', err);
        }
    });

program.parse(process.argv);
