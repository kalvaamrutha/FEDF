/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useStudents } from '../StudentContext';

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

const initialFormState = {
  name: '',
  rollNumber: '',
  email: '',
  age: '',
  grade: ''
};

export default function StudentForm() {
  const { addStudent, updateStudent, selectedStudent, setSelectedStudent } = useStudents();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Sync form with selected student for editing
  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        name: selectedStudent.name,
        rollNumber: selectedStudent.rollNumber,
        email: selectedStudent.email,
        age: selectedStudent.age.toString(),
        grade: selectedStudent.grade
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [selectedStudent]);

  // Form validation checks
  const validateField = (name, value) => {
    let errorMsg = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorMsg = 'Name is required';
        } else if (value.trim().length < 3) {
          errorMsg = 'Name must be at least 3 characters';
        }
        break;
      case 'rollNumber':
        if (!value.trim()) {
          errorMsg = 'Roll number is required';
        } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
          errorMsg = 'Only letters, numbers, and hyphens allowed';
        } else if (value.trim().length < 3) {
          errorMsg = 'Must be at least 3 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMsg = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errorMsg = 'Please enter a valid email address';
        }
        break;
      case 'age':
        if (!value) {
          errorMsg = 'Age is required';
        } else {
          const num = parseInt(value, 10);
          if (isNaN(num) || num < 5 || num > 100) {
            errorMsg = 'Age must be a valid number between 5 and 100';
          }
        }
        break;
      case 'grade':
        if (!value) {
          errorMsg = 'Please select a grade';
        }
        break;
      default:
        break;
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let result;
    if (selectedStudent) {
      result = updateStudent(selectedStudent.id, formData);
    } else {
      result = addStudent(formData);
    }

    if (result.success) {
      // Clear form on success
      setFormData(initialFormState);
      setErrors({});
    } else {
      // Set server/context validation error (e.g. rollNumber duplicate)
      setErrors((prev) => ({ ...prev, rollNumber: result.error }));
    }
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <div className="glass-card">
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        {selectedStudent ? 'Edit Student Details' : 'Add New Student'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Student Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-name">
            Full Name
          </label>
          <input
            id="student-name"
            name="name"
            type="text"
            className={`input-field ${errors.name ? 'error' : ''}`}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Roll Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-roll">
            Roll Number / ID
          </label>
          <input
            id="student-roll"
            name="rollNumber"
            type="text"
            className={`input-field ${errors.rollNumber ? 'error' : ''}`}
            placeholder="e.g. ST-201"
            value={formData.rollNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-email">
            Email Address
          </label>
          <input
            id="student-email"
            name="email"
            type="email"
            className={`input-field ${errors.email ? 'error' : ''}`}
            placeholder="e.g. john.doe@school.edu"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Age */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-age">
            Age (years)
          </label>
          <input
            id="student-age"
            name="age"
            type="number"
            className={`input-field ${errors.age ? 'error' : ''}`}
            placeholder="e.g. 20"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        {/* Grade */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-grade">
            Grade / Academic Mark
          </label>
          <select
            id="student-grade"
            name="grade"
            className={`input-field ${errors.grade ? 'error' : ''}`}
            value={formData.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          >
            <option value="" disabled>
              Select Grade
            </option>
            {GRADE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                Grade {opt}
              </option>
            ))}
          </select>
          {errors.grade && <span className="error-text">{errors.grade}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {selectedStudent ? 'Update Student' : 'Add Student'}
          </button>
          
          {(selectedStudent || formData.name || formData.rollNumber || formData.email || formData.age || formData.grade) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
