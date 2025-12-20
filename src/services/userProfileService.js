import axiosClient from '../api/axiosClient';
import graphqlClient from '../api/graphqlClient';

// Lấy hồ sơ người dùng qua GraphQL getUserProfile
export const getMyProfile = async (userId) => {
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
    const data = await graphqlClient.query(query, { userId });
    const profile = data?.getUserProfile;
    if (profile) return { success: true, data: profile };
    return { success: false, error: 'Không tìm thấy hồ sơ' };
  } catch (error) {
    console.error('Get profile error', error);
    return { success: false, error: error.message || 'Không thể tải hồ sơ' };
  }
};

// Lấy hồ sơ bất kỳ (dùng chung getUserProfile)
export const getProfileById = getMyProfile;

// Cập nhật hồ sơ qua REST /api/user-profiles (backend UserProfileController)
// Trả lại toàn bộ payload lỗi (nếu có) để UI hiển thị chi tiết validation
export const updateMyProfile = async (_userId, profileData) => {
  const token = localStorage.getItem('vh_access_token');
  const payload = {
    email: profileData.email || '',
    fullName: profileData.fullName || '',
    username: profileData.username || '',
    avatarId: profileData.avatarId || '',
    bio: profileData.bio || ''
  };
  try {
    const resp = await fetch('/api/user-profiles', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return {
        success: false,
        error: body?.message || 'Không thể cập nhật hồ sơ',
        raw: body,
      };
    }
    return { success: true, data: body, message: body?.message || 'Cập nhật thành công' };
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

// Danh sách người dùng (GraphQL findUserProfiles)
export const findUserProfiles = async (page = 0, size = 10) => {
  try {
    const query = `
      query FindUserProfiles($page: Int, $size: Int) {
        findUserProfiles(page: $page, size: $size) {
          content {
            userId
            username
            fullName
            avatarId
            email
            status
            createdAt
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
    return { success: true, data: data.findUserProfiles };
  } catch (error) {
    console.error('Find user profiles error', error);
    return { success: false, error: error.message || 'Không thể tải danh sách người dùng' };
  }
};
