import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task'; 
import AddTask from './AddTask'; 

const Column = ({ title, tasks, onAddTask, onMoveTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => onMoveTask(item.id, title),
  });

  return (
    <div
      ref={drop}
      style={{ border: '1px solid gray', padding: '10px', margin: '10px', width: '200px' }}
    >
      <h3>{title}</h3>
      {tasks.map((task) => (
        task && <Task key={task.id} id={task.id} content={task.content} />
      ))}
      { title == "ToDo" && <AddTask onAddTask={(content) => onAddTask(content, title)} />}
    </div>
  );
};

export default Column;
