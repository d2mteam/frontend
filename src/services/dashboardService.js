import graphqlClient from '../api/graphqlClient';

// Lấy dữ liệu tổng quan dashboard (overview/trending) theo schema GraphQL
export const getDashboardOverview = async (hours = 24, size = 5) => {
  try {
    const query = `
      query DashboardOverview($hours: Int, $size: Int) {
        dashboardOverview(hours: $hours, size: $size) {
          newlyPublished {
            eventId
            eventName
            eventDescription
            eventLocation
          }
          recentWithNewPosts {
            event {
              eventId
              eventName
              eventDescription
              eventLocation
            }
            newPostCount
            latestPostAt
          }
          trending {
            event {
              eventId
              eventName
              eventDescription
              eventLocation
            }
            newMemberCount
            newCommentCount
            newLikeCount
            latestInteractionAt
          }
        }
      }
    `;

    const data = await graphqlClient.query(query, { hours, size });
    return { success: true, data: data.dashboardOverview };
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    return { success: false, error: error.message || 'Không thể tải dashboard' };
  }
};

