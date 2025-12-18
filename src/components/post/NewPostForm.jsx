import React, { useState } from 'react';
import '../../assets/styles/event-posts.css'

export default function NewPostForm({ onCreate, relatedTo }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onCreate({
      title: title.trim(),
      body: body.trim(),
      image: image.trim() || null,
      relatedTo: relatedTo || null,
    });
    setTitle('');
    setBody('');
    setImage('');
  };

  return (
    <form className="new-post-form" onSubmit={submit}>
      <input
        type="text"
        placeholder={`Tiêu đề thảo luận`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '98%', padding: 10, borderRadius: 8, marginBottom: 8, border: '1px solid #ddd' }}
      />

      <textarea
        placeholder={`Viết thảo luận, câu hỏi hoặc chia sẻ...`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        style={{ width: '98%', padding: 10, borderRadius: 8, marginBottom: 8, border: '1px solid #ddd' }}
      />

      <input
        type="text"
        placeholder="Image URL (ví dụ: /images/xxx.jpg)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ width: '98%', padding: 10, borderRadius: 8, marginBottom: 8, border: '1px solid #ddd' }}
      />

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="submit" className="join-btn">Đăng thảo luận</button>
      </div>
    </form>
  );
}