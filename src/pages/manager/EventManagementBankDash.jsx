import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Eye, Edit, Trash2, Plus,
  Search, Filter, Clock, TrendingUp, CheckCircle, AlertCircle,
  Shield, Grid, List, MessageSquare, Heart, X
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventService";

const EventManagementBankDash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    eventName: '',
    eventDescription: '',
    eventLocation: '',
    eventDate: ''
  });

  // Fetch events created by this manager
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEvents(0, 100);
      
      if (response.success && response.data) {
        // Filter only events created by this manager
        const mapped = response.data
          .filter(event => event.creatorInfo?.userId === user?.id)
          .map(event => ({
            id: event.eventId,
            title: event.eventName || 'Sự kiện',
            description: event.eventDescription || '',
            location: event.eventLocation || 'Chưa xác định',
            startAt: event.createdAt,
            endAt: event.updatedAt,
            status: 'APPROVED', // Default since backend doesn't have event_state in GraphQL
            memberCount: event.memberCount || 0,
            memberLimit: 999,
            postCount: event.postCount || 0,
            likeCount: event.likeCount || 0,
            creatorInfo: event.creatorInfo || {},
            createdAt: event.createdAt || new Date().toISOString()
          }));
        setEvents(mapped);
      } else {
        setEvents([]);
        setError(response.error || "Không thể tải danh sách sự kiện");
      }
    } catch (error) {
      setEvents([]);
      setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      showNotification("Không thể tải danh sách sự kiện", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "EVENT_MANAGER") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "EVENT_MANAGER") return;
    fetchEvents();
  }, [user]);

  // Filter logic
  const filteredEvents = () => {
    let filtered = events;
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Stats calculation
  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'PENDING').length,
    approved: events.filter(e => e.status === 'APPROVED').length,
    ongoing: events.filter(e => e.status === 'ONGOING').length
  };

  // Status display
  const getStatusDisplay = (status) => {
    const map = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      ONGOING: "Đang diễn ra",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy"
    };
    return map[status] || status;
  };

  const getStatusBadgeStyle = (status) => {
    const map = {
      PENDING: { bg: '#FEF3C7', text: '#92400E', icon: '⏳' },
      APPROVED: { bg: '#DBEAFE', text: '#1E40AF', icon: '✅' },
      ONGOING: { bg: '#D1FAE5', text: '#065F46', icon: '🔥' },
      COMPLETED: { bg: '#E0E7FF', text: '#3730A3', icon: '🎉' },
      CANCELLED: { bg: '#FEE2E2', text: '#991B1B', icon: '❌' }
    };
    return map[status] || map.PENDING;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // Modal handlers
  const handleCreate = () => {
    setEditingEvent(null);
    setForm({
      eventName: '',
      eventDescription: '',
      eventLocation: '',
      eventDate: new Date().toISOString()
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      eventName: event.title,
      eventDescription: event.description,
      eventLocation: event.location,
      eventDate: event.startAt
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
    
    try {
      const response = await deleteEvent(eventId);
      if (response.success) {
        showNotification("Đã xóa sự kiện", "success");
        fetchEvents();
      } else {
        showNotification(response.error || "Không thể xóa sự kiện", "error");
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi xóa sự kiện", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.eventName.trim()) {
      showNotification("Vui lòng nhập tên sự kiện", "error");
      return;
    }
    
    try {
      if (editingEvent) {
        // Update event
        const response = await updateEvent(editingEvent.id, form);
        if (response.success) {
          showNotification("Cập nhật sự kiện thành công", "success");
          setShowModal(false);
          fetchEvents();
        } else {
          showNotification(response.error || "Không thể cập nhật sự kiện", "error");
        }
      } else {
        // Create new event
        const response = await createEvent(form);
        if (response.success) {
          showNotification("Tạo sự kiện thành công", "success");
          setShowModal(false);
          fetchEvents();
        } else {
          showNotification(response.error || "Không thể tạo sự kiện", "error");
        }
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi", "error");
    }
  };

  // Navigate to event posts
  const handleViewPosts = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <Sidebar />
      
      <div style={{ marginLeft: '280px', width: 'calc(100vw - 280px)' }} className="p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D60FF]/5 to-[#16DBCC]/5 rounded-[30px] blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)', boxShadow: '0 8px 24px rgba(45, 96, 255, 0.3)' }}>
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2D60FF] to-[#16DBCC] bg-clip-text text-transparent">
                    Quản Lý Sự Kiện
                  </h1>
                  <p className="text-sm mt-1" style={{ color: '#718EBF' }}>
                    Tạo và quản lý các sự kiện của bạn
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 rounded-2xl font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-white"
                  style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}
                >
                  <Plus className="w-5 h-5" />
                  Tạo sự kiện mới
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-5 py-3 rounded-2xl font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  style={{ backgroundColor: 'white', color: '#2D60FF', border: '2px solid #E5E7EB' }}
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                  {viewMode === 'grid' ? 'Danh sách' : 'Lưới'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="group relative bg-white rounded-[28px] p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2D60FF]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300" 
                     style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #0A06F4 100%)' }}>
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#343C6A' }}>
                    {stats.total}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#718EBF' }}>
                Tổng sự kiện
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-[28px] p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#718EBF' }}>
                Chờ duyệt
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-[28px] p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-blue-400 to-indigo-500">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.approved}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#718EBF' }}>
                Đã duyệt
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-[28px] p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-500">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.ongoing}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#718EBF' }}>
                Đang diễn ra
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[28px] shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5" style={{ color: '#2D60FF' }} />
            <h3 className="font-bold text-lg" style={{ color: '#343C6A' }}>Tìm Kiếm & Lọc</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" 
                      style={{ color: searchTerm ? '#2D60FF' : '#718EBF' }} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-[30px] focus:ring-2 focus:ring-[#2D60FF] focus:outline-none transition-all border-2 border-transparent focus:border-[#2D60FF]/20 shadow-sm"
                style={{ backgroundColor: '#F5F7FA', color: '#343C6A', fontWeight: '500' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 rounded-[30px] font-semibold focus:ring-2 focus:ring-[#2D60FF] focus:outline-none transition-all border-2 border-transparent focus:border-[#2D60FF]/20 shadow-sm cursor-pointer"
              style={{ backgroundColor: '#F5F7FA', color: '#343C6A' }}
            >
              <option value="ALL">📊 Tất cả trạng thái</option>
              <option value="PENDING">⏳ Chờ duyệt</option>
              <option value="APPROVED">✅ Đã duyệt</option>
              <option value="ONGOING">🔥 Đang diễn ra</option>
              <option value="COMPLETED">🎉 Hoàn thành</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="mt-5 px-6 py-3 text-sm font-bold rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              style={{ 
                color: '#2D60FF',
                backgroundColor: 'rgba(45, 96, 255, 0.1)',
                border: '2px solid rgba(45, 96, 255, 0.2)'
              }}
            >
              <X className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Events Display */}
        {loading ? (
          <div className="bg-white rounded-[28px] shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-block w-12 h-12 border-4 border-[#2D60FF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium" style={{ color: '#718EBF' }}>
              Đang tải sự kiện...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-[28px] shadow-lg p-12 text-center border border-gray-100">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-sm font-medium text-red-500 mb-2">Đã xảy ra lỗi</p>
            <p className="text-sm" style={{ color: '#718EBF' }}>{error}</p>
          </div>
        ) : filteredEvents().length === 0 ? (
          <div className="bg-white rounded-[28px] shadow-lg p-12 text-center border border-gray-100">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#718EBF' }} />
            <p className="text-sm font-medium" style={{ color: '#343C6A' }}>
              {events.length === 0 ? 'Bạn chưa tạo sự kiện nào' : 'Không tìm thấy sự kiện'}
            </p>
            <p className="text-sm mb-4" style={{ color: '#718EBF' }}>
              {events.length === 0 ? 'Hãy tạo sự kiện đầu tiên của bạn!' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
            </p>
            {events.length === 0 && (
              <button
                onClick={handleCreate}
                className="mt-4 px-6 py-3 rounded-2xl font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-white"
                style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Tạo sự kiện mới
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents().map((event) => {
                  const statusBadge = getStatusBadgeStyle(event.status);
                  
                  return (
                    <div key={event.id} className="group relative bg-white rounded-[28px] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span 
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                          style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                        >
                          <span>{statusBadge.icon}</span>
                          {getStatusDisplay(event.status)}
                        </span>
                      </div>

                      {/* Event Header */}
                      <div className="relative h-32 overflow-hidden">
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}></div>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-4 left-6 right-6">
                          <h3 className="text-white font-bold text-lg line-clamp-2">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#718EBF' }}>
                          {event.description || 'Không có mô tả'}
                        </p>

                        <div className="space-y-3 mb-5">
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#343C6A' }}>
                            <Calendar className="w-4 h-4" style={{ color: '#2D60FF' }} />
                            <span className="font-medium">{formatDate(event.startAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#343C6A' }}>
                            <MapPin className="w-4 h-4" style={{ color: '#2D60FF' }} />
                            <span className="font-medium line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#343C6A' }}>
                            <Users className="w-4 h-4" style={{ color: '#2D60FF' }} />
                            <span className="font-medium">{event.memberCount} thành viên</span>
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#718EBF' }}>
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-semibold">{event.postCount}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#718EBF' }}>
                            <Heart className="w-4 h-4" />
                            <span className="font-semibold">{event.likeCount}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewPosts(event.id)}
                            className="flex-1 px-4 py-2.5 rounded-2xl font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)', color: 'white' }}
                          >
                            <Eye className="w-4 h-4" />
                            Xem
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2.5 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                            style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2.5 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-[28px] shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead style={{ backgroundColor: '#F5F7FA' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Sự kiện</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Địa điểm</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Thời gian</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Trạng thái</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Thành viên</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Hoạt động</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ color: '#718EBF' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEvents().map((event) => {
                        const statusBadge = getStatusBadgeStyle(event.status);
                        
                        return (
                          <tr key={event.id} className="hover:bg-gradient-to-r hover:from-[#2D60FF]/5 hover:to-transparent transition-all duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                                  style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}
                                >
                                  <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm truncate" style={{ color: '#343C6A' }}>{event.title}</p>
                                  <p className="text-xs truncate" style={{ color: '#718EBF' }}>{event.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm" style={{ color: '#718EBF' }}>
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm" style={{ color: '#718EBF' }}>
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">{formatDate(event.startAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span 
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                                style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                              >
                                <span>{statusBadge.icon}</span>
                                {getStatusDisplay(event.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-sm font-semibold" style={{ color: '#343C6A' }}>
                                <Users className="w-4 h-4" style={{ color: '#2D60FF' }} />
                                {event.memberCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-3 text-sm" style={{ color: '#718EBF' }}>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="font-semibold">{event.postCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  <span className="font-semibold">{event.likeCount}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewPosts(event.id)}
                                  className="p-2.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                  style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)', color: 'white' }}
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="p-2.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                  style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="p-2.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                  style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Summary Stats */}
        {!loading && !error && filteredEvents().length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[28px] p-6 border-2 border-blue-200/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">Tổng quan sự kiện của bạn</p>
                  <p className="text-xs text-blue-700">Hiển thị {filteredEvents().length} / {events.length} sự kiện</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{events.reduce((sum, e) => sum + e.memberCount, 0)}</div>
                  <div className="text-xs text-blue-700">Tổng thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{events.reduce((sum, e) => sum + e.postCount, 0)}</div>
                  <div className="text-xs text-blue-700">Tổng bài viết</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{events.reduce((sum, e) => sum + e.likeCount, 0)}</div>
                  <div className="text-xs text-blue-700">Tổng lượt thích</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 lg:p-16 backdrop-blur-sm animate-fadeIn" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-[30px] shadow-2xl max-w-3xl w-full transform transition-all duration-300 animate-slideUp"
            style={{ 
              maxHeight: 'calc(100vh - 8rem)',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Gradient */}
            <div className="relative overflow-hidden">
              <div 
                className="absolute inset-0" 
                style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}
              ></div>
              <div className="relative px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {editingEvent ? (
                      <Edit className="w-6 h-6 text-white" />
                    ) : (
                      <Plus className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {editingEvent ? 'Cập nhật thông tin sự kiện của bạn' : 'Điền thông tin để tạo sự kiện tình nguyện'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <div className="group">
                  <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#343C6A' }}>
                    <Calendar className="w-4 h-4" style={{ color: '#2D60FF' }} />
                    Tên sự kiện <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.eventName}
                      onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                      className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-200 focus:border-[#2D60FF] focus:outline-none transition-all font-medium shadow-sm group-hover:shadow-md"
                      style={{ color: '#343C6A', backgroundColor: '#F5F7FA' }}
                      placeholder="Ví dụ: Chiến dịch trồng cây xanh 2025"
                      required
                    />
                    <div className="absolute inset-0 rounded-[20px] border-2 border-transparent group-hover:border-[#2D60FF]/20 pointer-events-none transition-all"></div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="group">
                  <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#343C6A' }}>
                    <MessageSquare className="w-4 h-4" style={{ color: '#2D60FF' }} />
                    Mô tả chi tiết
                  </label>
                  <div className="relative">
                    <textarea
                      value={form.eventDescription}
                      onChange={(e) => setForm({ ...form, eventDescription: e.target.value })}
                      className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-200 focus:border-[#2D60FF] focus:outline-none transition-all resize-none font-medium shadow-sm group-hover:shadow-md"
                      style={{ color: '#343C6A', backgroundColor: '#F5F7FA' }}
                      rows="5"
                      placeholder="Mô tả chi tiết về sự kiện: mục đích, hoạt động, yêu cầu..."
                    />
                    <div className="absolute inset-0 rounded-[20px] border-2 border-transparent group-hover:border-[#2D60FF]/20 pointer-events-none transition-all"></div>
                  </div>
                  <p className="mt-2 text-xs" style={{ color: '#718EBF' }}>
                    💡 Mô tả chi tiết sẽ giúp tình nguyện viên hiểu rõ hơn về sự kiện
                  </p>
                </div>

                {/* Event Location */}
                <div className="group">
                  <label className="block text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#343C6A' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#2D60FF' }} />
                    Địa điểm tổ chức
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.eventLocation}
                      onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                      className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-200 focus:border-[#2D60FF] focus:outline-none transition-all font-medium shadow-sm group-hover:shadow-md"
                      style={{ color: '#343C6A', backgroundColor: '#F5F7FA' }}
                      placeholder="Ví dụ: Công viên Thống Nhất, Hà Nội"
                    />
                    <div className="absolute inset-0 rounded-[20px] border-2 border-transparent group-hover:border-[#2D60FF]/20 pointer-events-none transition-all"></div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="relative overflow-hidden rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg, rgba(45, 96, 255, 0.08) 0%, rgba(22, 219, 204, 0.08) 100%)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}>
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>
                        Lưu ý khi tạo sự kiện
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: '#718EBF' }}>
                        <li>• Sự kiện của Manager cần được Admin phê duyệt trước khi hiển thị</li>
                        <li>• Hãy cung cấp thông tin đầy đủ và chính xác</li>
                        <li>• Bạn có thể chỉnh sửa hoặc xóa sự kiện sau khi tạo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 rounded-[20px] font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-2"
                    style={{ 
                      backgroundColor: 'white',
                      color: '#718EBF',
                      borderColor: '#E5E7EB'
                    }}
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 rounded-[20px] font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-white relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #2D60FF 0%, #16DBCC 100%)' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {editingEvent ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Cập nhật sự kiện
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Tạo sự kiện ngay
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EventManagementBankDash;
