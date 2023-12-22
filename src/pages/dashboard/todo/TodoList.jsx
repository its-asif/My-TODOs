import React, { useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { AuthContext } from '../../../providers/AuthProvider';
import { v4 as uuidv4 } from 'uuid';

export let totalTasks = 0;
export let completedTasks = 0;

const TodoList = () => {
  const {user} = useContext(AuthContext);
  const userEmail = user?.email;
  const axiosPublic = useAxiosPublic();
  const [tasks, setTasks] = useState({
    todo: [],
    ongoing: [],
    completed: [],
  });

  // Fetching initial todo list
  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const response = await axiosPublic.get(`/todo-lists/${userEmail}`);
        const todoLists = response.data;

        console.log(todoLists)

        if (todoLists) {
          setTasks({
            todo: todoLists.tasks.todo || [],
            ongoing: todoLists.tasks.ongoing || [],
            completed: todoLists.tasks.completed || [],
          });
        }
      } catch (error) {
        console.error('Error fetching todo lists:', error);
      }
    };

    fetchTodoLists();
  }, [axiosPublic]);

  // updating number of tasks
  useEffect(() => {
    totalTasks = tasks.todo.length + tasks.ongoing.length + tasks.completed.length;
    completedTasks = tasks.completed.length;
  }, [tasks]);


  const handleAddTask = (content, column) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [column.toLowerCase()]: [
        ...prevTasks[column.toLowerCase()],
        { id: uuidv4(), content },
      ],
    }));
  };

const handleMoveTask = async (taskId, targetColumn) => {
  try {
    const sourceColumn = Object.keys(tasks).find((column) =>
      tasks[column].some((task) => task.id === taskId)
    );

    if (!sourceColumn || sourceColumn === targetColumn.toLowerCase()) {
      return;
    }

    // Create a new copy of tasks
    const updatedTasks = { ...tasks };

    // Find the index of the moved task in the source column
    const movedTaskIndex = updatedTasks[sourceColumn.toLowerCase()].findIndex((task) => task.id === taskId);

    if (movedTaskIndex !== -1) {
      // Remove the task from the source column
      updatedTasks[sourceColumn.toLowerCase()] = updatedTasks[sourceColumn.toLowerCase()].filter((task) => task.id !== taskId);

      // Add the task to the target column
      updatedTasks[targetColumn.toLowerCase()] = [
        ...(updatedTasks[targetColumn.toLowerCase()] || []),
        tasks[sourceColumn.toLowerCase()][movedTaskIndex],
      ];

      // If moving to "Completed," set the other columns to null
      if (targetColumn.toLowerCase() === 'completed') {
        updatedTasks.todo = updatedTasks.todo.filter((task) => task.id !== taskId);
        updatedTasks.ongoing = Array(3).fill(null);
      }

      // Update the state with the changes
      setTasks(updatedTasks);

      // Update the backend using Axios
      const response = await axiosPublic.post('/todo-lists/swap-tasks', {
        userEmail: userEmail,
        sourceColumn: sourceColumn.toLowerCase(),
        targetColumn: targetColumn.toLowerCase(),
        taskId: taskId,
        content: tasks[sourceColumn.toLowerCase()][movedTaskIndex].content,
      });

      console.log('Backend updated successfully:', response.data);
    }
  } catch (error) {
    console.error('Failed to update backend:', error);
  }
};


  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-2xl font-bold text-center my-6 " style={{ 
        background: 'linear-gradient(to right, #f953c6 0%, #b91d73 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>Tasks List</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Column
          title="ToDo"
          tasks={tasks.todo}
          onAddTask={(content) => handleAddTask(content, 'todo')}
          onMoveTask={handleMoveTask}
        />
        <Column
          title="Ongoing"
          tasks={tasks.ongoing}
          onAddTask={(content) => handleAddTask(content, 'ongoing')}
          onMoveTask={handleMoveTask}
        />
        <Column
          title="Completed"
          tasks={tasks.completed}
          onAddTask={(content) => handleAddTask(content, 'completed')}
          onMoveTask={handleMoveTask}
        />
      </div>
    </DndProvider>
  );
};

export default TodoList;
