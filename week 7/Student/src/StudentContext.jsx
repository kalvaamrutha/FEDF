/* eslint-disable react-hooks/purity, react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

const initialMockStudents = [
  { id: '1', name: 'Aiden Vance', rollNumber: 'ST-101', email: 'aiden.vance@academy.edu', age: 20, grade: 'A+' },
  { id: '2', name: 'Brooke Miller', rollNumber: 'ST-102', email: 'brooke.m@academy.edu', age: 21, grade: 'A' },
  { id: '3', name: 'Charlie Green', rollNumber: 'ST-103', email: 'c.green@academy.edu', age: 19, grade: 'B+' },
  { id: '4', name: 'Diana Prince', rollNumber: 'ST-104', email: 'diana.prince@academy.edu', age: 22, grade: 'A-' }
];

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const stored = localStorage.getItem('academy_students');
      return stored ? JSON.parse(stored) : initialMockStudents;
    } catch (e) {
      console.error('Failed to load students from localStorage:', e);
      return initialMockStudents;
    }
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('academy_students', JSON.stringify(students));
  }, [students]);

  // Toast notification management
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Student
  const addStudent = (studentData) => {
    // Unique Roll Number check (case-insensitive)
    const exists = students.some(
      (s) => s.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase()
    );

    if (exists) {
      addToast(`Roll number "${studentData.rollNumber}" already exists!`, 'danger');
      return { success: false, error: 'Roll number must be unique.' };
    }

    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      name: studentData.name.trim(),
      rollNumber: studentData.rollNumber.trim().toUpperCase(),
      email: studentData.email.trim().toLowerCase(),
      age: parseInt(studentData.age, 10),
    };

    setStudents((prev) => [newStudent, ...prev]);
    addToast(`Successfully added student: ${newStudent.name}`, 'success');
    return { success: true };
  };

  // Update Student
  const updateStudent = (id, studentData) => {
    // Unique Roll Number check ignoring the current student being updated
    const exists = students.some(
      (s) => s.id !== id && s.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase()
    );

    if (exists) {
      addToast(`Roll number "${studentData.rollNumber}" is already in use by another student!`, 'danger');
      return { success: false, error: 'Roll number must be unique.' };
    }

    const updated = {
      ...studentData,
      id,
      name: studentData.name.trim(),
      rollNumber: studentData.rollNumber.trim().toUpperCase(),
      email: studentData.email.trim().toLowerCase(),
      age: parseInt(studentData.age, 10),
    };

    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    
    // Clear selection state if we were editing this student
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
    }

    addToast(`Successfully updated student: ${updated.name}`, 'success');
    return { success: true };
  };

  // Delete Student
  const deleteStudent = (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    if (!studentToDelete) return;

    setStudents((prev) => prev.filter((s) => s.id !== id));

    // Clear selection if we are deleting the edited student
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
    }

    addToast(`Successfully removed student: ${studentToDelete.name}`, 'warning');
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        selectedStudent,
        setSelectedStudent,
        addStudent,
        updateStudent,
        deleteStudent,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
export default StudentContext;