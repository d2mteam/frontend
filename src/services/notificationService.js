import client from '../api/client';

// Get all notifications
export const getNotifications = async (unreadOnly = false) => {
  const response = await client.get('/notifications', {
    params: { unreadOnly },
  });
  return response.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await client.put(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await client.put('/notifications/read-all');
  return response.data;
};

// Subscribe to push notifications
export const subscribeToPush = async (subscription) => {
  const response = await client.post('/notifications/subscribe', {
    subscription,
  });
  return response.data;
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (endpoint) => {
  const response = await client.post('/notifications/unsubscribe', {
    endpoint,
  });
  return response.data;
};

// Get VAPID public key
export const getVapidPublicKey = async () => {
  const response = await client.get('/notifications/vapid-public-key');
  return response.data;
};
