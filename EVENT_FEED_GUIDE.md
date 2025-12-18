# Event Feed - Facebook-like Social Feed for Events

## 📋 Overview
Event Feed component giống Facebook Wall, cho phép người dùng:
- ✍️ Đăng bài viết về sự kiện
- ❤️ Like/Unlike bài viết (Optimistic Update)
- 💬 Comment vào bài viết
- 🔄 Real-time UI updates

## 🎯 Features

### 1. Create Post
- Input box giống Facebook: "Bạn đang nghĩ gì về sự kiện này?"
- Avatar người dùng hiện tại
- Nút "Đăng" với loading state
- **Optimistic Update**: Bài viết xuất hiện ngay lập tức

### 2. Post Card
- Header: Avatar + Username + Time ago
- Body: Nội dung bài viết
- Footer Stats: Số lượt thích + số bình luận
- Actions: Like, Comment, Share buttons

### 3. Like System
- Click icon Heart → Đổi màu đỏ + tăng count
- **Optimistic Update** với rollback khi lỗi
- Toggle on/off

### 4. Comment System
- Click "Bình luận" → Hiện input box
- Gõ Enter hoặc click Send icon
- **Optimistic Update**: Comment xuất hiện ngay
- Comment list với avatar + username + time

## 📁 File Structure

```
frontend/src/
├── components/
│   └── event/
│       └── EventFeed.jsx           # Main component
├── services/
│   └── postService.js              # API service (GraphQL)
└── pages/
    └── volunteer/
        └── EventPosts.jsx          # Page wrapper (nếu cần)
```

## 🚀 Usage

### 1. Import component

```jsx
import EventFeed from '../components/event/EventFeed';

function EventPostsPage() {
  return (
    <div>
      <EventFeed />
    </div>
  );
}
```

### 2. Routing setup (App.jsx hoặc Router)

```jsx
import EventFeed from './components/event/EventFeed';

<Route path="/eventPosts/:eventId" element={<EventFeed />} />
```

### 3. Navigate to Event Feed

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(`/eventPosts/${eventId}`);
```

## 🔧 GraphQL Integration

### Required Mutations

```graphql
# Create Post
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    ok
    id
    message
    createdAt
  }
}

# Like Post
mutation LikePost($input: LikeInput!) {
  like(input: $input) {
    ok
    message
  }
}

# Create Comment
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    ok
    id
    message
    createdAt
  }
}
```

### Required Query

```graphql
query GetEventFeed($eventId: ID!, $page: Int!, $size: Int!) {
  findPosts(page: $page, size: $size) {
    content {
      postId
      eventId
      content
      createdAt
      likeCount
      commentCount
      isLiked
      creatorInfo {
        userId
        username
        avatarId
      }
      listComments {
        commentId
        content
        createdAt
        creatorInfo {
          userId
          username
          avatarId
        }
      }
    }
  }
}
```

## 🗄️ Database Schema

### Table: posts
```sql
CREATE TABLE posts (
  post_id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(event_id),
  user_id UUID REFERENCES user_profiles(user_id),
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: comments
```sql
CREATE TABLE comments (
  comment_id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(post_id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(user_id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: likes
```sql
CREATE TABLE likes (
  like_id BIGSERIAL PRIMARY KEY,
  target_id BIGINT NOT NULL,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'COMMENT')),
  user_id UUID REFERENCES user_profiles(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(target_id, target_type, user_id)
);
```

## 🎨 Styling

Component sử dụng **Tailwind CSS** với design tokens:
- Background: `bg-gray-100` (page), `bg-white` (cards)
- Shadows: `shadow-sm`
- Rounded: `rounded-lg`, `rounded-full`, `rounded-3xl`
- Colors: 
  - Primary: `green-600` (buttons)
  - Danger: `red-600` (liked state)
  - Gray: `gray-100`, `gray-500`, `gray-800`

## 🔄 Optimistic Updates

### Post Creation
```jsx
// 1. Tạo post mới tức thì (fake ID)
const newPost = {
  postId: Date.now(),
  content: newPostContent,
  likeCount: 0,
  commentCount: 0,
  creatorInfo: user,
};

// 2. Add vào đầu list
setPosts(prev => [newPost, ...prev]);

// 3. Gọi API
await createPost({ eventId, body: newPostContent });

// 4. API thành công → Keep UI
// 5. API thất bại → Rollback
```

### Like Toggle
```jsx
// 1. Update UI ngay lập tức
setPosts(prev => prev.map(post => 
  post.postId === postId ? { ...post, isLiked: !post.isLiked } : post
));

// 2. Gọi API
const response = await likePost(postId);

// 3. Nếu thất bại → Rollback
if (!response.success) {
  setPosts(prev => prev.map(post => 
    post.postId === postId ? { ...post, isLiked: !post.isLiked } : post
  ));
}
```

## 📊 State Management

```jsx
const [posts, setPosts] = useState([]);           // Danh sách posts
const [loading, setLoading] = useState(true);     // Loading state
const [newPostContent, setNewPostContent] = useState(''); // Input tạo post
const [postingNew, setPostingNew] = useState(false);      // Submit state
const [commentingPostId, setCommentingPostId] = useState(null); // Post đang comment
const [commentText, setCommentText] = useState({}); // Object: { postId: text }
```

## 🔐 Authentication

Component requires:
- `useAuth()` context → `user` object với:
  - `userId`
  - `username` hoặc `email`
  - `avatarId`

## 📦 Dependencies

```json
{
  "lucide-react": "^0.x.x",
  "react-router-dom": "^6.x.x"
}
```

## 🐛 Troubleshooting

### Issue: "Cannot read property 'userId' of null"
**Solution**: Kiểm tra AuthContext đang cung cấp user object

### Issue: GraphQL errors
**Solution**: Kiểm tra backend GraphQL schema và resolvers

### Issue: Avatar không hiển thị
**Solution**: Đảm bảo `VITE_API_BASE_URL` được set trong `.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🎯 Next Steps

1. ✅ Thêm upload ảnh vào post
2. ✅ Thêm edit/delete post
3. ✅ Thêm reply to comment
4. ✅ Thêm real-time updates (WebSocket)
5. ✅ Thêm pagination cho posts
6. ✅ Thêm emoji picker

## 📝 Example Backend (Spring Boot)

### Entity: Post.java
```java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    
    private Long eventId;
    private UUID userId;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    
    // Getters & Setters
}
```

### GraphQL Resolver
```java
@Component
public class PostResolver {
    
    @SchemaMapping(typeName = "Mutation", field = "createPost")
    public CreatePostPayload createPost(@Argument CreatePostInput input) {
        // Logic tạo post
    }
    
    @SchemaMapping(typeName = "Query", field = "findPosts")
    public Page<Post> findPosts(@Argument int page, @Argument int size) {
        // Logic lấy posts
    }
}
```

## 📞 Support

Nếu gặp vấn đề, check:
1. Console logs (F12) xem có lỗi API không
2. Network tab xem GraphQL request/response
3. Backend logs xem có exception không

---

**Created by**: GitHub Copilot  
**Version**: 1.0.0  
**Last Updated**: December 17, 2025
