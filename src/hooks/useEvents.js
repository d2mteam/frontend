/**
 * Custom Hooks for Event Data Fetching
 * Using Apollo Client GraphQL
 */
import { useState, useEffect } from 'react';
import { getAllEvents, getEventById, getDashboardEvents } from '../services/eventService';

/**
 * Hook to fetch all events with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {object} { events, loading, error, refetch }
 */
export const useEvents = (page = 0, size = 10) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEvents(page, size);
      
      if (response.success) {
        setEvents(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, size]);

  return { events, loading, error, totalPages, refetch: fetchEvents };
};

/**
 * Hook to fetch single event with nested posts & comments
 * @param {string} eventId - Event Snowflake ID
 * @returns {object} { event, posts, loading, error, refetch }
 */
export const useEventDetail = (eventId) => {
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetail = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getEventById(eventId);
      
      if (response.success) {
        const eventData = response.data;
        setEvent({
          id: eventData.eventId,
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          startAt: eventData.startAt,
          endAt: eventData.endAt,
          memberCount: eventData.memberCount,
          postCount: eventData.postCount,
          creator: eventData.creatorInfo
        });

        // Extract nested posts
        if (eventData.listPosts?.content) {
          const mappedPosts = eventData.listPosts.content.map(post => ({
            id: post.postId,
            content: post.content,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            creator: post.creatorInfo,
            comments: post.listComment?.content?.map(c => ({
              id: c.commentId,
              content: c.content,
              createdAt: c.createdAt,
              likeCount: c.likeCount,
              creator: c.creatorInfo
            })) || []
          }));
          setPosts(mappedPosts);
        }
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  return { event, posts, loading, error, refetch: fetchEventDetail };
};

/**
 * Hook to fetch dashboard events (limited)
 * @param {number} limit - Number of events to fetch
 * @returns {object} { events, loading, error, refetch }
 */
export const useDashboardEvents = (limit = 6) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardEvents(limit);
      
      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [limit]);

  return { events, loading, error, refetch: fetchDashboard };
};
