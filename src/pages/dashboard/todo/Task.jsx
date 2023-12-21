import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ id, content }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        padding: '8px',
        margin: '4px',
        backgroundColor: 'lightblue',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {content}
    </div>
  );
};

export default Task;
