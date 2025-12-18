import axiosClient from '../api/axiosClient';

// Lấy hồ sơ người dùng hiện tại (GraphQL có getUserProfile nhưng REST ở đây chỉ hỗ trợ create/edit)
// Giữ hàm để tương thích UI, có thể dùng GraphQL getUserProfile nếu cần chi tiết
export const getMyProfile = async (userId) => {
  // Tạm dùng GraphQL getUserProfile qua axiosClient.post /graphql nếu cần
  try {
    const query = `
      query GetUserProfile($userId: ID!) {
        getUserProfile(userId: $userId) {
          userId
          username
          fullName
          avatarId
          email
          bio
          status
          createdAt
        }
      }
    `;
    const resp = await axiosClient.post('/graphql', { query, variables: { userId } });
    const profile = resp?.data?.data?.getUserProfile;
    if (profile) {
      return { success: true, data: profile };
    }
    return { success: false, error: 'Không tìm thấy hồ sơ' };
  } catch (error) {
    console.error('Get profile error', error);
    return { success: false, error: error.message || 'Không thể tải hồ sơ' };
  }
};

// Tạo/sửa hồ sơ qua REST /api/user-profiles (backend UserProfileController)
export const updateMyProfile = async (userId, profileData) => {
  try {
    const payload = { userId, ...profileData };
    const data = await axiosClient.put('/user-profiles', payload);
    return { success: true, data, message: 'Cập nhật thành công' };
  } catch (error) {
    console.error('Update profile error', error);
    return { success: false, error: error.message || 'Không thể cập nhật hồ sơ' };
  }
};

export const createMyProfile = async (userId, profileData) => {
  try {
    const payload = { userId, ...profileData };
    const data = await axiosClient.post('/user-profiles', payload);
    return { success: true, data, message: 'Tạo hồ sơ thành công' };
  } catch (error) {
    console.error('Create profile error', error);
    return { success: false, error: error.message || 'Không thể tạo hồ sơ' };
  }
};

