import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';

const AddTask = ({ onAddTask }) => {
  const [content, setContent] = useState('');
  const [existingTasks, setExistingTasks] = useState([]);
  const {user} = useContext(AuthContext);
  const userEmail = user?.email;

  useEffect(() => {
    // Fetch existing tasks for the user
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://taskflow-azure.vercel.app/todo-lists/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          tasks: { todo: [newTask] }, // Send the new task as an array
        }),
      });
      } catch (error) {
        console.error('Error fetching existing tasks:', error);
      }
    };

    fetchTasks();
  }, [userEmail]);


  const handleAddTask = async () => {
    if (content.trim() !== '') {
      try {
        const newTask = content.trim();
        const updatedTasks = [...existingTasks, newTask];
  
        const response = await fetch(`https://taskflow-azure.vercel.app/todo-lists/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            tasks: updatedTasks,
          }),
        });
  
        if (response.ok) {
          // Task added successfully
          onAddTask(newTask);
          setContent('');
          setExistingTasks(updatedTasks); // Update state with the new tasks
        } else {
          console.error('Failed to add task. Server returned:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };
  

  return (
    <div style={{ marginTop: '10px' }}>
      <input
        type="text"
        className="border-2 border-black rounded-lg w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="btn btn-sm btn-outline w-full mt-3" onClick={handleAddTask}>
        Add Task
      </button>
    </div>
  );
};

export default AddTask;
