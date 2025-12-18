import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { initializePushNotifications } from '../services/pushService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // State for user management
  const [pendingManagers, setPendingManagers] = useState([]);
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);

  // Load user management data from localStorage
  useEffect(() => {
    const loadUserManagementData = () => {
      try {
        const managers = localStorage.getItem('vh_pending_managers');
        const volunteers = localStorage.getItem('vh_volunteers');
        
        if (managers) {
          setPendingManagers(JSON.parse(managers));
        } else {
          // Seed initial managers data if not exists
          const initialManagers = [
            {
              id: 'mgr-001',
              name: 'Nguyen Van Manager',
              email: 'manager@charity.com',
              password: '123456',
              phone: '0901234567',
              approved: true,
              locked: false,
              createdAt: new Date('2025-01-01').toISOString()
            },
            {
              id: 'mgr-002',
              name: 'Tran Thi Quan Ly',
              email: 'quanly@charity.com',
              password: '123456',
              phone: '0902345678',
              approved: false,
              locked: false,
              createdAt: new Date('2025-12-01').toISOString()
            },
            {
              id: 'mgr-003',
              name: 'Le Van Admin',
              email: 'admin2@charity.com',
              password: '123456',
              phone: '0903456789',
              approved: true,
              locked: true,
              createdAt: new Date('2025-06-15').toISOString()
            }
          ];
          setPendingManagers(initialManagers);
          localStorage.setItem('vh_pending_managers', JSON.stringify(initialManagers));
        }
        
        if (volunteers) {
          setRegisteredVolunteers(JSON.parse(volunteers));
        } else {
          // Seed initial volunteers data if not exists
          const initialVolunteers = [
            {
              id: 'vol-001',
              name: 'Pham Van Volunteer',
              email: 'minh@volunteer.com',
              password: '123456',
              phone: '0911234567',
              locked: false,
              createdAt: new Date('2025-02-10').toISOString()
            },
            {
              id: 'vol-002',
              name: 'Hoang Thi Nguyen',
              email: 'nguyen@volunteer.com',
              password: '123456',
              phone: '0912345678',
              locked: false,
              createdAt: new Date('2025-03-20').toISOString()
            },
            {
              id: 'vol-003',
              name: 'Vo Van Tinh',
              email: 'tinh@volunteer.com',
              password: '123456',
              phone: '0913456789',
              locked: true,
              createdAt: new Date('2025-05-05').toISOString()
            },
            {
              id: 'vol-004',
              name: 'Dang Thi Mai',
              email: 'mai@volunteer.com',
              password: '123456',
              phone: '0914567890',
              locked: false,
              createdAt: new Date('2025-07-12').toISOString()
            },
            {
              id: 'vol-005',
              name: 'Bui Van Hung',
              email: 'hung@volunteer.com',
              password: '123456',
              phone: '0915678901',
              locked: false,
              createdAt: new Date('2025-08-25').toISOString()
            }
          ];
          setRegisteredVolunteers(initialVolunteers);
          localStorage.setItem('vh_volunteers', JSON.stringify(initialVolunteers));
        }
      } catch (error) {
        console.error('Failed to load user management data:', error);
      }
    };
    
    loadUserManagementData();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'vh_pending_managers' && e.newValue) {
        setPendingManagers(JSON.parse(e.newValue));
      }
      if (e.key === 'vh_volunteers' && e.newValue) {
        setRegisteredVolunteers(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Khôi phục session khi reload trang - Dùng token thay vì localStorage user
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('vh_access_token');
      
      if (token) {
        try {
          // Decode token để lấy userId
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.user_id;
          
          // Fetch profile từ backend (có mock fallback trong service)
          const profileResult = await authService.getUserProfile(userId);
          
          if (profileResult.data) {
            // Decode token để lấy role từ JWT
            const roles = payload.roles || [];
            
            const userData = {
              id: userId,
              userId: userId, // Add userId field
              ...profileResult.data,
              role: roles[0] || 'ADMIN' // Default to ADMIN if no role (for mock testing)
            };
            
            // Log if using mock data
            if (profileResult.isMock) {
              console.info('🎭 Using Mock Admin Profile for UI Testing');
            }
            
            setUser(userData);
          } else {
            // Profile load failed even with mock fallback - logout to reset
            console.error('❌ Profile load completely failed. Logging out...');
            logout();
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Any error during load - clear everything and logout
          console.warn('🔄 Clearing invalid session...');
          logout();
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Gọi REST Login để lấy Token
      const loginResult = await authService.login(email, password);
      
      // 2. Decode token để lấy userId và roles
      const token = loginResult.accessToken || localStorage.getItem('vh_access_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;
      const roles = payload.roles || [];

      // 3. Gọi GraphQL để lấy Profile chi tiết
      let userProfile = {};
      try {
        const profileResult = await authService.getUserProfile(userId);
        userProfile = profileResult.data || {};
      } catch (err) {
        console.warn("User has no profile yet or error fetching profile");
      }

      // 4. Merge data - Role chỉ lấy từ JWT token
      const finalUserData = {
        id: userId,
        email: email,
        ...userProfile,
        role: roles[0] || 'USER' // Lấy role đầu tiên từ JWT, không có fallback từ profile
      };

      // 5. Save state - CHỈ set state, KHÔNG dùng localStorage.setItem('vh_user')
      setUser(finalUserData);
      
      // 6. Setup Push Notification
      setupPushNotification();
      
      setIsAuthOpen(false);
      return finalUserData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthOpen(false);
  };

  const setupPushNotification = async () => {
     try {
        await initializePushNotifications();
     } catch (e) {
        console.log("Push init skipped");
     }
  };

  // User Management Functions
  const approveManager = (managerId) => {
    setPendingManagers(prev => {
      const updated = prev.map(m => 
        m.id === managerId ? { ...m, approved: true } : m
      );
      localStorage.setItem('vh_pending_managers', JSON.stringify(updated));
      return updated;
    });
  };

  const updateManagers = (managers) => {
    setPendingManagers(managers);
    localStorage.setItem('vh_pending_managers', JSON.stringify(managers));
  };

  const updateVolunteers = (volunteers) => {
    setRegisteredVolunteers(volunteers);
    localStorage.setItem('vh_volunteers', JSON.stringify(volunteers));
  };

  // UI Helpers
  const openAuth = (mode = 'login') => { setAuthMode(mode); setIsAuthOpen(true); };
  const closeAuth = () => setIsAuthOpen(false);
  const switchMode = (mode) => setAuthMode(mode);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      isAuthOpen, authMode, openAuth, closeAuth, switchMode, 
      loading,
      // User Management
      pendingManagers,
      registeredVolunteers,
      approveManager,
      updateManagers,
      updateVolunteers
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}