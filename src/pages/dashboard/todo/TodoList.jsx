// TodoList.jsx
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column'; // Import the Column component

const TodoList = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, content: 'Demo Task 1' },
      { id: 2, content: 'Demo Task 2' },
    ],
    ongoing: [
      { id: 3, content: 'Demo Task 3' },
      { id: 4, content: 'Demo Task 4' },
    ],
    completed: [
      { id: 5, content: 'Demo Task 5' },
      { id: 6, content: 'Demo Task 6' },
    ],
  });

  const handleAddTask = (content, column) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [column.toLowerCase()]: [...prevTasks[column.toLowerCase()], { id: Date.now(), content }],
    }));
  };

  const handleMoveTask = (taskId, targetColumn) => {
    setTasks((prevTasks) => {
      const sourceColumn = Object.keys(prevTasks).find((column) =>
        prevTasks[column].some((task) => task.id === taskId)
      );

      if (!sourceColumn || sourceColumn === targetColumn.toLowerCase()) {
        return prevTasks;
      }

      const movedTask = prevTasks[sourceColumn].find((task) => task.id === taskId);

      const updatedTasks = { ...prevTasks };

      updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
        (task) => task.id !== taskId
      );

      updatedTasks[targetColumn.toLowerCase()] = Array.isArray(
        updatedTasks[targetColumn.toLowerCase()]
      )
        ? updatedTasks[targetColumn.toLowerCase()]
        : [];

      updatedTasks[targetColumn.toLowerCase()].push(movedTask);

      console.log('Updated tasks:', updatedTasks);
      return updatedTasks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
