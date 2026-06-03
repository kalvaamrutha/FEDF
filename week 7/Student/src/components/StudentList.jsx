import { useState } from 'react';
import { useStudents } from '../StudentContext';

const GRADE_FILTER_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

export default function StudentList() {
  const { students, setSelectedStudent, selectedStudent, deleteStudent } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  // Get initials for avatar badge
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Determine avatar color class based on student ID to maintain color consistency
  const getAvatarColor = (id) => {
    const colors = ['blue', 'green', 'orange', 'pink'];
    const index = parseInt(id.replace(/\D/g, '') || '0', 10) % colors.length;
    return colors[index] || 'blue';
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
  };

  const handleDeleteClick = (student) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${student.name} (${student.rollNumber})?`);
    if (confirmed) {
      deleteStudent(student.id);
    }
  };

  // Filter students based on search and grade dropdown
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = selectedGrade === '' || student.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="glass-card" style={{ flexGrow: 1 }}>
      <h2 className="glass-card-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Student Directory ({filteredStudents.length} of {students.length})
      </h2>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="input-field search-field"
            placeholder="Search by name, roll, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="input-field filter-select"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">All Grades</option>
          {GRADE_FILTER_OPTIONS.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      {/* Students List Display */}
      {filteredStudents.length === 0 ? (
        <div className="no-students">
          <div className="no-students-icon">🕵️‍♂️</div>
          <h3>No Students Found</h3>
          <p>We couldn't find any student matches for your current search filters.</p>
          {(searchQuery || selectedGrade) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('');
              }}
              style={{ marginTop: '8px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="student-grid">
          {filteredStudents.map((student) => {
            const isEditing = selectedStudent && selectedStudent.id === student.id;
            return (
              <div
                key={student.id}
                className="student-card"
                style={isEditing ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px var(--primary-light)' } : {}}
              >
                <div className="card-header">
                  <div className={`avatar-badge ${getAvatarColor(student.id)}`}>
                    {getInitials(student.name)}
                  </div>
                  <div className="student-meta">
                    <span className="student-name" title={student.name}>
                      {student.name}
                    </span>
                    <span className="student-roll">{student.rollNumber}</span>
                  </div>
                  <span className="grade-badge">Grade {student.grade}</span>
                </div>

                <div className="card-body">
                  <div className="body-item" title={student.email}>
                    <svg
                      className="body-item-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {student.email}
                  </div>
                  <div className="body-item">
                    <svg
                      className="body-item-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    {student.age} years old
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-secondary card-btn"
                    onClick={() => handleEditClick(student)}
                    disabled={isEditing}
                  >
                    {isEditing ? 'Editing...' : 'Edit'}
                  </button>
                  <button
                    className="btn btn-danger card-btn"
                    onClick={() => handleDeleteClick(student)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
