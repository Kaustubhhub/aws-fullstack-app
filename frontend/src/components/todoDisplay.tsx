import { useState } from "react";

type TodoType = {
    id: string;
    title: string;
};

const TodoDisplay = () => {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [newTodo, setNewTodo] = useState<string>("");

    const handleSubmit = () => {
        if (!newTodo.trim()) return; // Prevent adding empty tasks
        const objToPush = {
            id: `todo${Math.random() * 1000}`,
            title: newTodo.trim(),
        };
        setTodos((prevTodos) => [...prevTodos, objToPush]);
        setNewTodo("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Your Daily Task List
                </h1>
                <p className="text-gray-600 mt-2">
                    Organize your day efficiently!
                </p>
            </div>

            <div className="flex items-center mt-6 space-x-2">
                <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    type="text"
                    placeholder="Enter your task here..."
                />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
                >
                    Add
                </button>
            </div>

            {todos.length === 0 ? (
                <div className="mt-6 text-gray-500 italic">
                    No tasks added yet. Start organizing your day!
                </div>
            ) : (
                <div className="mt-6 w-full max-w-md bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                        Task List
                    </h2>
                    <ul className="space-y-2">
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-sm"
                            >
                                <span className="text-gray-800">{todo.title}</span>
                                <span className="text-sm text-gray-400">
                                    {todo.id}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TodoDisplay;
