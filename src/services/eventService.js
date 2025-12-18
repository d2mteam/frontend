/**
 * Event Service
 * - Đọc dữ liệu qua GraphQL (findEvents, getEvent, listPost/listComment)
 * - Ghi dữ liệu (đăng ký/hủy đăng ký sự kiện) qua REST
 */
import graphqlClient from '../api/graphqlClient';
import axiosClient from '../api/axiosClient';

const parseModeration = (res) => ({
  success: res?.result === 'SUCCESS' || !res?.result,
  message: res?.message || '',
  data: res,
  toastType: res?.result === 'SUCCESS' || !res?.result ? 'success' : 'error',
});

// ===================== READ (GraphQL) ===================== //

export const getAllEvents = async (page = 0, size = 10) => {
  try {
    const query = `
      query FindEvents($page: Int, $size: Int) {
        findEvents(page: $page, size: $size) {
          content {
            eventId
            eventName
            eventDescription
            eventLocation
            createdAt
            updatedAt
            likeCount
            createBy {
              userId
              username
              fullName
              avatarId
            }
          }
          pageInfo {
            page
            size
            totalElements
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;

    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: data.findEvents.content, pageInfo: data.findEvents.pageInfo };
  } catch (error) {
    console.error('Get all events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách sự kiện' };
  }
};

export const getEventById = async (eventId, postPage = 0, postSize = 5, commentSize = 10) => {
  try {
    const query = `
      query GetEvent($eventId: ID!, $postPage: Int!, $postSize: Int!, $commentSize: Int!) {
        getEvent(eventId: $eventId) {
          eventId
          eventName
          eventDescription
          eventLocation
          createdAt
          updatedAt
          likeCount
          createBy {
            userId
            username
            fullName
            avatarId
          }
          listPost(page: $postPage, size: $postSize) {
            pageInfo {
              page
              size
              totalElements
              totalPages
              hasNext
              hasPrevious
            }
            content {
              postId
              content
              createdAt
              updatedAt
              likeCount
              createBy {
                userId
                username
                fullName
                avatarId
              }
              listComment(page: 0, size: $commentSize) {
                pageInfo {
                  page
                  size
                  totalElements
                  totalPages
                  hasNext
                  hasPrevious
                }
                content {
                  commentId
                  content
                  createdAt
                  updatedAt
                  likeCount
                  createBy {
                    userId
                    username
                    fullName
                    avatarId
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await graphqlClient.query(query, { eventId, postPage, postSize, commentSize });
    return { success: true, data: data.getEvent };
  } catch (error) {
    console.error('Get event by ID error:', error);
    return { success: false, error: error.message || 'Không thể tải thông tin sự kiện' };
  }
};

// Lịch sử tham gia (RoleInEvent) của user hiện tại
export const getParticipationHistory = async (page = 0, size = 20) => {
  try {
    const query = `
      query UserHistory($page: Int, $size: Int) {
        userHistory(page: $page, size: $size) {
          content {
            id
            participationStatus
            eventRole
            createdAt
            updatedAt
            event {
              eventId
              eventName
              eventDescription
              eventLocation
              createdAt
              updatedAt
            }
          }
          pageInfo {
            page
            size
            totalElements
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;

    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: data.userHistory };
  } catch (error) {
    console.error('Get participation history error:', error);
    return { success: false, error: error.message || 'Không thể tải lịch sử tham gia' };
  }
};

// ID các sự kiện đã đăng ký của tôi (placeholder vì backend chưa có)
export const getMyRegisteredEventIds = async () => {
  return { success: true, data: [] };
};

// ===================== WRITE (REST) ===================== //

export const registerForEvent = async (eventId) => {
  try {
    const data = await axiosClient.post(`/events/${eventId}/registrations`);
    return parseModeration(data);
  } catch (error) {
    console.error('Register for event error:', error);
    return { success: false, error: error.message || 'Không thể đăng ký sự kiện' };
  }
};

export const unregisterFromEvent = async (eventId) => {
  try {
    const data = await axiosClient.delete(`/events/${eventId}/registrations`);
    return parseModeration(data);
  } catch (error) {
    console.error('Unregister from event error:', error);
    return { success: false, error: error.message || 'Không thể hủy đăng ký sự kiện' };
  }
};

// ===================== ADMIN / MANAGER (REST - chuẩn bị cho bước sau) ===================== //

export const createEvent = async (eventData) => {
  try {
    const data = await axiosClient.post('/events', eventData);
    return parseModeration(data);
  } catch (error) {
    console.error('Create event error:', error);
    return { success: false, error: error.message || 'Không thể tạo sự kiện' };
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const data = await axiosClient.put('/events', { eventId, ...eventData });
    return parseModeration(data);
  } catch (error) {
    console.error('Update event error:', error);
    return { success: false, error: error.message || 'Không thể cập nhật sự kiện' };
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const data = await axiosClient.delete(`/events/${eventId}`);
    return parseModeration(data);
  } catch (error) {
    console.error('Delete event error:', error);
    return { success: false, error: error.message || 'Không thể xóa sự kiện' };
  }
};

export const approveEvent = async (eventId) => {
  try {
    const data = await axiosClient.post(`/events/${eventId}/approve`);
    return parseModeration(data);
  } catch (error) {
    console.error('Approve event error:', error);
    return { success: false, error: error.message || 'Không thể duyệt sự kiện' };
  }
};

export const rejectEvent = async (eventId) => {
  // Backend không có API reject event, placeholder để tránh gọi sai
  return { success: false, error: 'Chức năng từ chối sự kiện chưa được hỗ trợ bởi backend' };
};

// Placeholder cho màn manager (chưa có API backend)
export const getRegistrationsByEvent = async (_eventId) => {
  return { success: false, error: 'Chức năng lấy danh sách đăng ký chưa được backend hỗ trợ' };
};

export const approveRegistration = async (registrationId) => {
  try {
    const data = await axiosClient.post(`/event-registrations/${registrationId}/approve`);
    return parseModeration(data);
  } catch (error) {
    console.error('Approve registration error:', error);
    return { success: false, error: error.message || 'Không thể duyệt đăng ký' };
  }
};

export const rejectRegistration = async (registrationId) => {
  try {
    const data = await axiosClient.post(`/event-registrations/${registrationId}/reject`);
    return parseModeration(data);
  } catch (error) {
    console.error('Reject registration error:', error);
    return { success: false, error: error.message || 'Không thể từ chối đăng ký' };
  }
};

// Danh sách thành viên sự kiện (GraphQL)
export const listMemberInEvent = async (eventId, page = 0, size = 20) => {
  try {
    const query = `
      query ListMemberInEvent($eventId: ID!, $page: Int, $size: Int) {
        listMemberInEvent(eventId: $eventId, page: $page, size: $size) {
          content {
            id
            participationStatus
            eventRole
            userProfile {
              userId
              username
              fullName
              email
              avatarId
            }
            event {
              eventId
              eventName
            }
          }
          pageInfo {
            page
            size
            totalElements
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;
    const data = await graphqlClient.query(query, { eventId, page, size });
    return { success: true, data: data.listMemberInEvent };
  } catch (error) {
    console.error('List members error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách tình nguyện viên' };
  }
};

// Dashboard sử dụng findEvents nên có thể tái dùng getAllEvents
export const getDashboardEvents = async (limit = 5) => {
  const result = await getAllEvents(0, limit);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return result;
};
