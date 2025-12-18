import React, { useState } from 'react';
import '../../assets/styles/event-posts.css';

export default function CommentForm({ onSubmit, avatar }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      <div className="comment-body">
        <img className="c-avatar" src={avatar} alt="avatar" />
        <input
          placeholder="Viết bình luận..."
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{border: 'none', background: 'transparent', outline: 'none', padding: '10px 0'}}
        />
        
        <button type="submit">Gửi</button>
      </div>
    </form>
  );
}