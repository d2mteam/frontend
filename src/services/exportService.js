import axiosClient from '../api/axiosClient';

// Export event-volunteer data (ADMIN)
// request = { fields: string[], format: 'json' | 'csv', eventIds?, eventRoles?, participationStatuses?, eventStates? }
export const exportEventVolunteers = async (request) => {
  try {
    const resp = await axiosClient.post('/exports/event-volunteers', request, {
      responseType: request.format === 'csv' ? 'blob' : 'json',
    });

    if (request.format === 'csv') {
      return { success: true, data: resp, isBlob: true };
    }
    return { success: true, data: resp, isBlob: false };
  } catch (error) {
    console.error('Export event-volunteers failed', error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message || 'Không thể xuất dữ liệu',
    };
  }
};

