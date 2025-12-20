import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/ColorScheme.css'
import './styles/ProfessionalLayout.css'
import './styles/animations.css'
import './styles/Auth.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { EventProvider } from './contexts/EventContext'

// Import public pages (landing page)
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import Hero from './pages/Hero'
import About from './pages/About'
import Events from './pages/Events'
import Footer from './components/Footer'

// Import auth pages
import OAuthCallback from './pages/auth/OAuthCallback'

// Import dashboard & volunteer pages
import Dashboard from './components/dashboard/Dashboard'
import EventPosts from './pages/volunteer/EventPosts'
import EventPostsNew from './pages/volunteer/EventPostsNew'
import EventPostsBankDash from './pages/volunteer/EventPostsBankDash'
import EventsVolunteer from './pages/volunteer/EventsVolunteer'
import History from './pages/volunteer/History'
import Notification from './pages/volunteer/Notification'
import EventFeed from './components/event/EventFeed'
import UserPublicProfile from './pages/UserPublicProfile'

// Import manager pages
import EventManagement from './pages/manager/EventManagement'
import EventManagementBankDash from './pages/manager/EventManagementBankDash'
import EventMembers from './pages/manager/EventMembers'

// Import admin pages
import AdminEventManagement from './pages/admin/EventManagementBankDash'
import UserManagement from './pages/admin/UserManagement'
import UserProfileManagement from './pages/admin/UserProfileManagement'
import ExportData from './pages/admin/ExportData'

// Import NotFound
import NotFound from './pages/notfound/NotFound'

// Landing page component (public)
function LandingPage() {
  const [currentSection, setCurrentSection] = useState('home')

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'sukien', 'aboutus', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Auth Modal */}
      <AuthModal />

      {/* Header */}
      <Header currentSection={currentSection} setCurrentPage={scrollToSection} currentPage={currentSection} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>

        {/* About Section */}
        <About />

        {/* Contact/Footer Section */}
        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  )
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

// Role-based route component
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  const userRole = user.role?.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// App Router
function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<Events />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Routes - Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfileManagement />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/users/:userId"
        element={
          <ProtectedRoute>
            <UserPublicProfile />
          </ProtectedRoute>
        }
      />

      {/* User routes */}
      <Route
        path="/user/events"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <EventsVolunteer />
          </RoleRoute>
        }
      />
      <Route
        path="/user/events/:eventId"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <EventFeed />
          </RoleRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <RoleRoute allowedRoles={['USER']}>
            <History />
          </RoleRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Event Manager routes */}
      <Route
        path="/event-manager/events"
        element={
          <RoleRoute allowedRoles={['EVENT_MANAGER']}>
            <EventManagement />
          </RoleRoute>
        }
      />
      <Route
        path="/event-manager/events/create"
        element={
          <RoleRoute allowedRoles={['EVENT_MANAGER']}>
            <EventManagement />
          </RoleRoute>
        }
      />
      <Route
        path="/event-manager/events/:eventId/manage"
        element={
          <RoleRoute allowedRoles={['EVENT_MANAGER']}>
            <EventMembers />
          </RoleRoute>
        }
      />

      {/* Compat routes for existing links */}
      <Route
        path="/eventPosts/:eventId"
        element={
          <ProtectedRoute>
            <EventFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventPostsNew/:eventId"
        element={
          <ProtectedRoute>
            <EventPostsNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventPostsBankDash/:eventId"
        element={
          <ProtectedRoute>
            <EventPostsBankDash />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/events"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminEventManagement />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/events/review"
        element={<Navigate to="/admin/events" replace />}
      />
      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <UserManagement />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/export"
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <ExportData />
          </RoleRoute>
        }
      />
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EventProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AppRouter />
          </Router>
        </EventProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
