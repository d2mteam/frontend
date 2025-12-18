import React from 'react';

export default function Post({
  title,
  organizer,
  date,
  image,
  body,
  likeCount,
  liked,
  onToggleLike,
  commentsCount,
}) {
  return (
    <article className="event-post">
      <header className="post-header">
        <div className="post-meta">
          <h1 className="post-title">{title}</h1>

          <div className="meta-row">
            <span className="meta-organizer">{organizer}</span>
            <span className="meta-dot"> • </span>
            <span className="meta-date">{date}</span>
          </div>
        </div>
      </header>

      <div className="post-body">
        <p className="post-text">{body}</p>
      </div>

      {image && (
        <div className="post-cover">
          <img src={image} alt="Post cover" />
        </div>
      )}

      <div className="post-stats">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          aria-pressed={liked ? 'true' : 'false'}
          title="Thích"
          type="button"
          onClick={onToggleLike}
        >
          <span className="like-icon">👍</span>
          <span className="like-count">{likeCount}</span>
          Thích
        </button>

        <div className="stat">💬 <strong>{commentsCount}</strong> bình luận</div>
      </div>
    </article>
  );
}