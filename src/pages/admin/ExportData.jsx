import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { exportEventVolunteers } from '../../services/exportService';
import { showNotification as showToast } from '../../services/toastService';
import { Download, Filter, FileText, ListChecks } from 'lucide-react';
import '../../assets/styles/unified-dashboard.css';

export default function ExportData() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [format, setFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [fields, setFields] = useState(['eventId', 'eventName', 'eventLocation', 'eventState', 'eventRole', 'participationStatus', 'username', 'email']);
  const [filters, setFilters] = useState({
    eventIds: '',
    eventRoles: [],
    participationStatuses: [],
    eventStates: []
  });

  // Check if user has admin role
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleExport = async () => {
    try {
      setExporting(true);
      if (!fields.length) {
        showToast('Chọn ít nhất 1 trường dữ liệu', 'error');
        setExporting(false);
        return;
      }

      const payload = {
        fields,
        format,
        eventIds: parseCsvNumbers(filters.eventIds),
        eventRoles: filters.eventRoles,
        participationStatuses: filters.participationStatuses,
        eventStates: filters.eventStates
      };

      const response = await exportEventVolunteers(payload);
      
      if (response.success) {
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `event_volunteers_${timestamp}.${format}`;

        if (response.isBlob) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          // JSON: download as file
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }

        showToast(`Đã xuất dữ liệu thành công: ${fileName}`, 'success');
      } else {
        showToast(response.error || 'Không thể xuất dữ liệu', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('Lỗi khi xuất dữ liệu', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleMultiChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleField = (field) => {
    setFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
  };

  const parseCsvNumbers = (val) => {
    if (!val) return [];
    return val.split(',').map(v => v.trim()).filter(Boolean).map(Number).filter(n => !Number.isNaN(n));
  };

  const fieldOptions = [
    { value: 'eventId', label: 'eventId' },
    { value: 'eventName', label: 'eventName' },
    { value: 'eventDescription', label: 'eventDescription' },
    { value: 'eventLocation', label: 'eventLocation' },
    { value: 'eventState', label: 'eventState' },
    { value: 'eventMetadata', label: 'eventMetadata' },
    { value: 'eventCreatedAt', label: 'eventCreatedAt' },
    { value: 'eventUpdatedAt', label: 'eventUpdatedAt' },
    { value: 'createdBy', label: 'createdBy' },
    { value: 'roleId', label: 'roleId' },
    { value: 'eventRole', label: 'eventRole' },
    { value: 'participationStatus', label: 'participationStatus' },
    { value: 'roleCreatedAt', label: 'roleCreatedAt' },
    { value: 'roleUpdatedAt', label: 'roleUpdatedAt' },
    { value: 'userId', label: 'userId' },
    { value: 'username', label: 'username' },
    { value: 'fullName', label: 'fullName' },
    { value: 'email', label: 'email' },
    { value: 'userStatus', label: 'userStatus' },
    { value: 'userCreatedAt', label: 'userCreatedAt' },
    { value: 'userUpdatedAt', label: 'userUpdatedAt' },
  ];

  const enumOptions = {
    eventRoles: ['EVENT_MEMBER', 'EVENT_ADMIN'],
    participationStatuses: ['APPROVED', 'LEFT_EVENT', 'COMPLETED'],
    eventStates: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'FINISHED']
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div className="page-header-title">
            <h1 className="page-title">Xuất tình nguyện viên theo sự kiện 📊</h1>
            <p className="page-subtitle">Xuất dữ liệu cần thiết</p>
          </div>
        </header>

        <div className="content-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Field selection */}
          <div className="form-group">
            <label className="form-label">
              <ListChecks className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
              Chọn trường dữ liệu (ít nhất 1)
            </label>
            <div className="tag-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {fieldOptions.map(opt => (
                <label key={opt.value} className="tag" style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: fields.includes(opt.value) ? '2px solid #10b981' : '1px solid #e5e7eb',
                  background: fields.includes(opt.value) ? '#ecfdf5' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={fields.includes(opt.value)}
                    onChange={() => toggleField(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="form-group">
            <label className="form-label">
              <FileText className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
              Định dạng file
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['csv', 'json'].map(fmt => (
                <label key={fmt} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${format === fmt ? '#10b981' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: format === fmt ? '#ecfdf5' : 'white',
                  transition: 'all 0.2s'
                }}>
                  <input 
                    type="radio" 
                    name="format" 
                    value={fmt} 
                    checked={format === fmt}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{ 
                      marginRight: '0.75rem',
                      width: '18px',
                      height: '18px',
                      accentColor: '#10b981'
                    }}
                  />
                  <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#0f172a' }}>
                    {fmt === 'csv' ? '📊 CSV' : '📄 JSON'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '12px',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: 600, 
              marginBottom: '1rem', 
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Filter className="w-4 h-4" />
              Bộ lọc (tùy chọn)
            </h3>
            
            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event IDs (phân tách bởi dấu phẩy)</label>
                <input 
                  type="text"
                  value={filters.eventIds}
                  onChange={(e) => setFilters(prev => ({ ...prev, eventIds: e.target.value }))}
                  placeholder="vd: 1,2,3"
                  className="form-input"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event Role</label>
                <select
                  multiple
                  value={filters.eventRoles}
                  onChange={(e) => handleMultiChange('eventRoles', Array.from(e.target.selectedOptions, o => o.value))}
                  className="form-select"
                  style={{ minHeight: '100px' }}
                >
                  {enumOptions.eventRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Participation Status</label>
                <select
                  multiple
                  value={filters.participationStatuses}
                  onChange={(e) => handleMultiChange('participationStatuses', Array.from(e.target.selectedOptions, o => o.value))}
                  className="form-select"
                  style={{ minHeight: '100px' }}
                >
                  {enumOptions.participationStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event State</label>
                <select
                  multiple
                  value={filters.eventStates}
                  onChange={(e) => handleMultiChange('eventStates', Array.from(e.target.selectedOptions, o => o.value))}
                  className="form-select"
                  style={{ minHeight: '100px' }}
                >
                  {enumOptions.eventStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              backgroundColor: exporting ? '#94a3b8' : '#10b981',
              cursor: exporting ? 'not-allowed' : 'pointer'
            }}
          >
            {exporting ? (
              <>
                <span style={{ fontSize: '1.25rem' }}>⏳</span>
                <span>Đang xuất dữ liệu...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Xuất dữ liệu</span>
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
            <strong>ℹ️ Lưu ý:</strong> Dữ liệu được xuất sẽ tuân theo bộ lọc đã chọn. 
            Nếu không chọn bộ lọc, tất cả dữ liệu sẽ được xuất.
          </div>
        </div>
      </main>
    </div>
  );
}
