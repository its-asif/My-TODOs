// AddTask.jsx
import React, { useState } from 'react';

const AddTask = ({ onAddTask }) => {
  const [content, setContent] = useState('');

  const handleAddTask = () => {
    if (content.trim() !== '') {
      onAddTask(content.trim());
      setContent('');
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default AddTask;
