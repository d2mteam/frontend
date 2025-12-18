/**
 * Blood Donation Service
 * Backend không có API, nên dùng mock tại frontend và tuyệt đối không gọi /api/blood-donation.
 */

// Mock data tại chỗ để UI còn dùng được
let MOCK_DATA = [
  { id: 1, fullName: 'Nguyen Van An', email: 'nguyenvanan90@gmail.com', phoneNumber: '0901234567', bloodType: 'O+', healthNote: null, registrationDate: '2025-01-20', status: 'pending' },
  { id: 2, fullName: 'Tran Thi Bich', email: 'bichtran@outlook.com', phoneNumber: '0918765432', bloodType: 'A-', healthNote: 'Huyết áp thấp nhẹ', registrationDate: '2025-01-22', status: 'pending' },
  { id: 3, fullName: 'Le Hoang Nam', email: 'nam.lh@company.vn', phoneNumber: '0933555777', bloodType: 'B+', healthNote: null, registrationDate: '2025-02-05', status: 'confirmed' },
  { id: 4, fullName: 'Pham Minh Tuan', email: 'tuanphamdev@gmail.com', phoneNumber: '0977888999', bloodType: 'AB+', healthNote: 'Đã tiêm vaccine cúm cách đây 1 tuần', registrationDate: '2025-02-10', status: 'confirmed' },
  { id: 5, fullName: 'Hoang Thi Mai', email: 'maihoang1995@yahoo.com', phoneNumber: '0909000111', bloodType: 'O-', healthNote: null, registrationDate: '2025-02-14', status: 'confirmed' },
  { id: 6, fullName: 'Vo Van Kiet', email: 'kietvv@edu.vn', phoneNumber: '0388999666', bloodType: 'A+', healthNote: 'Dị ứng phấn hoa', registrationDate: '2025-03-01', status: 'completed' },
  { id: 7, fullName: 'Dang Thuy Linh', email: 'linh.dang@gmail.com', phoneNumber: '0944555666', bloodType: 'B-', healthNote: null, registrationDate: '2025-03-05', status: 'completed' },
  { id: 8, fullName: 'Bui Tien Dung', email: 'dungbt_sport@gmail.com', phoneNumber: '0966777888', bloodType: 'AB-', healthNote: null, registrationDate: '2025-03-12', status: 'completed' },
  { id: 9, fullName: 'Doan Van Hau', email: 'hau.doan@football.vn', phoneNumber: '0988111222', bloodType: 'O+', healthNote: 'Từng phẫu thuật dây chằng năm 2023', registrationDate: '2025-03-20', status: 'pending' },
  { id: 10, fullName: 'Nguyen Thi Lan', email: 'lan.nguyen@bank.com', phoneNumber: '0911222333', bloodType: 'A+', healthNote: null, registrationDate: '2025-04-01', status: 'confirmed' }
];

const calcStats = () => {
  const byBloodType = MOCK_DATA.reduce((acc, d) => {
    acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
    return acc;
  }, {});
  return {
    totalDonors: MOCK_DATA.length,
    recentDonations: MOCK_DATA.filter(d => d.status === 'completed').length,
    upcomingDonations: MOCK_DATA.filter(d => d.status === 'pending').length,
    byBloodType,
  };
};

export const getAllBloodDonations = async () => {
  return { success: true, data: MOCK_DATA };
};

export const getBloodStatistics = async () => {
  return calcStats();
};

export const updateBloodDonationStatus = async (donationId, status) => {
  MOCK_DATA = MOCK_DATA.map(d => d.id === donationId ? { ...d, status } : d);
  return { success: true, id: donationId, status };
};

export const registerBloodDonation = async (donationData) => {
  const newId = Math.max(...MOCK_DATA.map(d => d.id)) + 1;
  const newDonation = { id: newId, status: 'pending', ...donationData };
  MOCK_DATA = [newDonation, ...MOCK_DATA];
  return { success: true, data: newDonation };
};

export const deleteBloodDonation = async (donationId) => {
  MOCK_DATA = MOCK_DATA.filter(d => d.id !== donationId);
  return { success: true, id: donationId };
};
