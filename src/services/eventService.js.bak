import client from '../api/client';

// Get all events
export const getAllEvents = async (filters = {}) => {
  try {
    const response = await client.get('/events/all', { params: filters });
    return { success: true, data: response.data || response };
  } catch (error) {
    console.error('Get all events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách sự kiện' };
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await client.get(`/events/${eventId}`);
    return { success: true, data: response.data || response };
  } catch (error) {
    console.error('Get event by ID error:', error);
    return { success: false, error: error.message || 'Không thể tải thông tin sự kiện' };
  }
};

// Register for event
export const registerForEvent = async (eventId) => {
  try {
    const response = await client.post('/events/register', { eventId });
    return { success: true, data: response.data || response, message: response.message };
  } catch (error) {
    console.error('Register for event error:', error);
    return { success: false, error: error.message || 'Không thể đăng ký sự kiện' };
  }
};

// Get user's registered events
export const getUserRegisteredEvents = async () => {
  try {
    const response = await client.get('/events/user/registered');
    return { success: true, data: response.data || response };
  } catch (error) {
    console.error('Get registered events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách đăng ký' };
  }
};

// Get participation history
export const getParticipationHistory = async () => {
  try {
    const response = await client.get('/events/user/history');
    return { success: true, data: response.data || response };
  } catch (error) {
    console.error('Get participation history error:', error);
    return { success: false, error: error.message || 'Không thể tải lịch sử tham gia' };
  }
};

// Create event (Manager/Admin)
export const createEvent = async (eventData) => {
  const response = await client.post('/events/create', eventData);
  return response.data;
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  const response = await client.put(`/events/${eventId}`, eventData);
  return response.data;
};

// Approve event (Admin)
export const approveEvent = async (eventId, approvalStatus) => {
  const response = await client.post(`/events/${eventId}/approve`, { approvalStatus });
  return response.data;
};

// Update registration status (Manager/Admin)
export const updateRegistrationStatus = async (registrationId, status) => {
  const response = await client.put(`/events/registration/${registrationId}/status`, { status });
  return response.data;
};

// Mark event as complete (Manager/Admin)
export const completeEvent = async (eventId) => {
  const response = await client.post(`/events/${eventId}/complete`);
  return response.data;
};

// Get registrations for an event (Manager/Admin)
export const getRegistrationsByEvent = async (eventId) => {
  try {
    const response = await client.get(`/api/events/${eventId}/registrations`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get registrations error:', error);
    return { success: false, error: error.response?.data?.message || 'Không thể tải danh sách đăng ký' };
  }
};
