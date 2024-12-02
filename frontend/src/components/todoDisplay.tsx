import { useState, useEffect } from "react";
import axios from "axios";

type TodoType = {
  id: string;
  title: string;
};

const apiUrl = "https://jno8gzzzph.execute-api.eu-north-1.amazonaws.com/items";

const TodoDisplay = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // Fetch all tasks from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTodos(response.data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add a new task
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return; // Prevent adding empty tasks
    const newTask = {
      id: `todo${Math.random() * 1000}`,
      title: newTodo.trim(),
    };

    try {
      await axios.put(apiUrl, newTask, {
        headers: { "Content-Type": "application/json" },
      });
      setTodos((prevTodos) => [...prevTodos, newTask]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete a task
  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Your Daily Task List</h1>
        <p className="text-gray-600 mt-2">Organize your day efficiently!</p>
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
          onClick={handleAddTodo}
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
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoDisplay;
