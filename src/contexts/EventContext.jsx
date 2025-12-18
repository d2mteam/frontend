import { createContext, useContext, useState, useEffect } from 'react'
import { getAllEvents } from '../services/eventService'

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within EventProvider')
  }
  return context
}

export const EventProvider = ({ children }) => {
  // Approved events (visible to everyone) - fetched from database
  const [approvedEvents, setApprovedEvents] = useState([])
  
  // Pending events (waiting for admin approval) - fetched from database
  const [pendingEvents, setPendingEvents] = useState([])
  
  // Loading state
  const [loading, setLoading] = useState(true)

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // Fetch all events (pagination: page 0, size 100)
        const response = await getAllEvents(0, 100)
        
        if (response.success && response.data) {
          // Map GraphQL Event model to frontend format
          const mappedEvents = response.data.map(event => ({
            id: event.eventId,
            image: event.creatorInfo?.avatarId || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&fit=crop',
            date: new Date(event.createdAt).toLocaleDateString('vi-VN'),
            title: event.eventName || 'Sự kiện',
            description: event.eventDescription || '',
            attendees: (event.memberCount || 0).toString(),
            location: event.eventLocation || '',
            createdBy: event.creatorInfo?.userId || 'unknown',
            createdAt: event.createdAt || new Date().toISOString(),
            startAt: event.createdAt,
            endAt: event.updatedAt,
            eventStatus: 'APPROVED',
            memberLimit: 999,
            postCount: event.postCount || 0,
            likeCount: event.likeCount || 0
          }))

          // Separate approved and pending based on eventStatus
          const approved = mappedEvents.filter(e => 
            e.eventStatus === 'APPROVED' || 
            e.eventStatus === 'ONGOING' || 
            e.eventStatus === 'COMPLETED'
          )
          const pending = mappedEvents.filter(e => e.eventStatus === 'PENDING')

          setApprovedEvents(approved)
          setPendingEvents(pending)
        }
      } catch (error) {
        console.error('Error fetching events from database:', error)
        // On error, set empty arrays (no fallback to localStorage)
        setApprovedEvents([])
        setPendingEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Refresh events from database (called after mutations)
  const refreshEvents = async () => {
    try {
      const response = await getAllEvents(0, 100)
      if (response.success && response.data) {
        const mappedEvents = response.data.map(event => ({
          id: event.eventId,
          image: event.creatorInfo?.avatarId || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&fit=crop',
          date: new Date(event.createdAt).toLocaleDateString('vi-VN'),
          title: event.eventName || 'Sự kiện',
          description: event.eventDescription || '',
          attendees: (event.memberCount || 0).toString(),
          location: event.eventLocation || '',
          createdBy: event.creatorInfo?.userId || 'unknown',
          createdAt: event.createdAt || new Date().toISOString(),
          startAt: event.createdAt,
          endAt: event.updatedAt,
          eventStatus: 'APPROVED',
          memberLimit: 999,
          postCount: event.postCount || 0,
          likeCount: event.likeCount || 0
        }))

        const approved = mappedEvents.filter(e => 
          e.eventStatus === 'APPROVED' || 
          e.eventStatus === 'ONGOING' || 
          e.eventStatus === 'COMPLETED'
        )
        const pending = mappedEvents.filter(e => e.eventStatus === 'PENDING')

        setApprovedEvents(approved)
        setPendingEvents(pending)
      }
    } catch (error) {
      console.error('Error refreshing events:', error)
    }
  }

  // Create event - Call backend GraphQL API
  const createEvent = async (eventData, creatorRole, creatorId) => {
    try {
      // Import createEvent từ eventService
      const { createEvent: createEventAPI } = await import('../services/eventService')
      
      // Map frontend data to GraphQL CreateEventInput
      const input = {
        eventName: eventData.title,
        eventDescription: eventData.description,
        eventLocation: eventData.location || 'Unknown',
        eventDate: eventData.date || new Date().toISOString()
      }

      const result = await createEventAPI(input)
      
      if (result.success) {
        // Refresh events from database
        await refreshEvents()
        
        // Manager events go to PENDING, Admin events may be auto-approved
        const message = creatorRole === 'manager' 
          ? 'Sự kiện đã được gửi. Vui lòng đợi admin phê duyệt.'
          : 'Sự kiện đã được tạo thành công!'
        
        return { success: true, message }
      } else {
        return { success: false, message: result.error || 'Không thể tạo sự kiện' }
      }
    } catch (error) {
      console.error('Error creating event:', error)
      return { success: false, message: error.message || 'Lỗi khi tạo sự kiện' }
    }
  }

  // Approve event (admin only) - Call backend GraphQL API
  const approveEvent = async (eventId, adminId) => {
    try {
      // Use eventService which has proper GraphQL mutation
      const mutation = 'mutation ApproveEvent($eventId: ID!) { approveEvent(eventId: $eventId) { ok message } }'
      
      const { default: graphqlClient } = await import('../api/graphqlClient')
      const data = await graphqlClient.mutation(mutation, { eventId })
      
      if (data.approveEvent.ok) {
        // Refresh events from database
        await refreshEvents()
        return { success: true, message: 'Đã phê duyệt sự kiện thành công!' }
      } else {
        return { success: false, message: data.approveEvent.message || 'Không thể phê duyệt' }
      }
    } catch (error) {
      console.error('Error approving event:', error)
      return { success: false, message: error.message || 'Lỗi khi phê duyệt sự kiện' }
    }
  }

  // Reject event (admin only) - Call backend GraphQL API
  const rejectEvent = async (eventId, reason = '') => {
    try {
      const { deleteEvent: deleteEventAPI } = await import('../services/eventService')
      const result = await deleteEventAPI(eventId)
      
      if (result.success) {
        await refreshEvents()
        return { success: true, message: 'Đã từ chối sự kiện!' }
      } else {
        return { success: false, message: result.error || 'Không thể từ chối' }
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      return { success: false, message: error.message || 'Lỗi khi từ chối sự kiện' }
    }
  }

  // Delete event (admin only) - Call backend GraphQL API
  const deleteEvent = async (eventId) => {
    try {
      const { deleteEvent: deleteEventAPI } = await import('../services/eventService')
      const result = await deleteEventAPI(eventId)
      
      if (result.success) {
        await refreshEvents()
        return { success: true, message: 'Đã xóa sự kiện!' }
      } else {
        return { success: false, message: result.error || 'Không thể xóa' }
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      return { success: false, message: error.message || 'Lỗi khi xóa sự kiện' }
    }
  }

  // Update event (admin/manager) - Call backend GraphQL API
  const updateEvent = async (eventId, updatedData) => {
    try {
      const { updateEvent: updateEventAPI } = await import('../services/eventService')
      
      // Map frontend data to GraphQL EditEventInput
      const input = {
        eventName: updatedData.title,
        eventDescription: updatedData.description,
        eventLocation: updatedData.location,
        eventDate: updatedData.date
      }

      const result = await updateEventAPI(eventId, input)
      
      if (result.success) {
        await refreshEvents()
        return { success: true, message: 'Đã cập nhật sự kiện!' }
      } else {
        return { success: false, message: result.error || 'Không thể cập nhật' }
      }
    } catch (error) {
      console.error('Error updating event:', error)
      return { success: false, message: error.message || 'Lỗi khi cập nhật sự kiện' }
    }
  }

  const value = {
    approvedEvents,
    pendingEvents,
    loading,
    createEvent,
    approveEvent,
    rejectEvent,
    deleteEvent,
    updateEvent,
    refreshEvents
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}
