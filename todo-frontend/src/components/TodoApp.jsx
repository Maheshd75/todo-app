import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    // Fetch all todos
    useEffect(() => {
        axios.get("http://127.0.0.1:8000")
            .then((response) => setTodos(response.data))
            .catch((error) => console.error(error));
    }, []);

    // Add a new To-Do
    const addTodo = () => {
        if (newTodo.trim() === "") return;
        axios.post("http://127.0.0.1:8000", { title: newTodo, completed: false })
            .then((response) => setTodos([...todos, response.data]))
            .catch((error) => console.error(error));
        setNewTodo("");
    };

    // Edit an existing To-Do
    const editTodo = (id) => {
        if (editedTitle.trim() === "") return;
        axios.put(`http://127.0.0.1:8000/api/todos/${id}/`, { title: editedTitle, completed: false })
            .then((response) => {
                setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
                setEditingTodo(null); // Exit editing mode
                setEditedTitle("");
            })
            .catch((error) => console.error(error));
    };

    // Delete a To-Do
    const deleteTodo = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`)
            .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
            .catch((error) => console.error(error));
    };

    // Toggle Completion Status
    const toggleCompletion = (id) => {
        const todo = todos.find((todo) => todo.id === id);
        axios.put(`http://127.0.0.1:8000/api/todos/${id}/`, { ...todo, completed: !todo.completed })
            .then((response) => setTodos(todos.map((todo) => (todo.id === id ? response.data : todo))))
            .catch((error) => console.error(error));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-6">To-Do List</h1>
            <div className="flex items-center space-x-2 mb-6">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                    className="border p-2 rounded-md w-64"
                />
                <button
                    onClick={addTodo}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <ul className="w-full max-w-md">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex justify-between items-center bg-white p-4 mb-4 shadow rounded-md">
                        {editingTodo === todo.id ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    placeholder="Edit task"
                                    className="border p-2 rounded-md w-52"
                                />
                                <button
                                    onClick={() => editTodo(todo.id)}
                                    className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingTodo(null);
                                        setEditedTitle("");
                                    }}
                                    className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <span
                                    className={`flex-1 cursor-pointer ${
                                        todo.completed ? "line-through text-gray-500" : "text-black"
                                    }`}
                                    onClick={() => toggleCompletion(todo.id)}
                                >
                                    {todo.title}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingTodo(todo.id);
                                            setEditedTitle(todo.title);
                                        }}
                                        className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
