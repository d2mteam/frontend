/**
 * User Admin Service
 * - Đọc danh sách user từ GraphQL findUserProfiles (backend có)
 * - Khóa/Mở khóa qua REST /api/users/{userId}/ban (backend có)
 * - Không có API duyệt/xóa user → trả lỗi rõ ràng
 */
import graphqlClient from '../api/graphqlClient';
import axiosClient from '../api/axiosClient';
import { showNotification } from './toastService';

export const getAllUserAuth = async (page = 0, size = 50) => {
  try {
    const query = `
      query FindUserProfiles($page: Int, $size: Int) {
        findUserProfiles(page: $page, size: $size) {
          content {
            userId
            username
            fullName
            email
            status
            createdAt
          }
          pageInfo {
            totalElements
            page
            size
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;
    const data = await graphqlClient.query(query, { page, size });
    return { 
      success: true, 
      data: data.findUserProfiles.content || [], 
      pageInfo: data.findUserProfiles.pageInfo || null 
    };
  } catch (error) {
    console.error('Get all user profiles error:', error);
    return { success: false, data: [], error: error.message || 'Không thể tải danh sách người dùng' };
  }
};

export const approveUser = async () => {
  showNotification('Backend không hỗ trợ duyệt tài khoản.', 'error');
  return { success: false, error: 'Backend không hỗ trợ duyệt tài khoản.' };
};

export const banUser = async (userId) => {
  try {
    const res = await axiosClient.post(`/users/${userId}/ban`);
    showNotification(res.message || 'Đã khóa tài khoản', 'success');
    return { success: true, message: res.message || 'Đã khóa tài khoản' };
  } catch (error) {
    showNotification(error.message || 'Không thể khóa người dùng', 'error');
    return { success: false, error: error.message || 'Không thể khóa người dùng' };
  }
};

export const unbanUser = async (userId) => {
  try {
    const res = await axiosClient.delete(`/users/${userId}/ban`);
    showNotification(res.message || 'Đã mở khóa tài khoản', 'success');
    return { success: true, message: res.message || 'Đã mở khóa tài khoản' };
  } catch (error) {
    showNotification(error.message || 'Không thể mở khóa người dùng', 'error');
    return { success: false, error: error.message || 'Không thể mở khóa người dùng' };
  }
};

export const deleteUser = async () => {
  showNotification('Backend không hỗ trợ xóa tài khoản.', 'error');
  return { success: false, error: 'Backend không hỗ trợ xóa tài khoản.' };
};
