import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProgramLeader.css";
import jsPDF from "jspdf";

function ProgramLeader() {
  const navigate = useNavigate();
  const [lecturerReports, setLecturerReports] = useState([]);
  const [programReports, setProgramReports] = useState([]);
  const [showReports, setShowReports] = useState(false);

  // --- Courses state ---
  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: "",
    lecturerName: "",
    className: "",
    dateOfLecture: "",
    scheduledTime: "",
    venue: "",
  });
  const [editingCourseIndex, setEditingCourseIndex] = useState(null);

  // --- Rating state (from StudentPage) ---
  const [averageRating, setAverageRating] = useState(0);

  // Load data - ADDED DATABASE CONNECTION
  useEffect(() => {
    loadLecturerReportsFromDB();
    loadCoursesFromDB();
    loadRatingsFromDB();
    
    // Load program reports from localStorage (same as before)
    const pReports = JSON.parse(localStorage.getItem("programReports")) || [];
    setProgramReports(pReports);
  }, [showReports]);

  // NEW: Load lecturer reports from database
  const loadLecturerReportsFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lecturer-reports');
      if (response.ok) {
        const data = await response.json();
        setLecturerReports(data);
        return;
      }
    } catch (error) {
      console.error('Error loading lecturer reports from DB:', error);
    }
    // Fallback to localStorage
    const reports = JSON.parse(localStorage.getItem("submittedReports")) || [];
    setLecturerReports(reports);
  };

  // NEW: Load courses from database
  const loadCoursesFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        return;
      }
    } catch (error) {
      console.error('Error loading courses from DB:', error);
    }
    // Fallback to localStorage
    const coursesList = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(coursesList);
  };

  // NEW: Load ratings from database
  const loadRatingsFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const values = data.filter(r => r.rating).map(r => r.rating);
        const avg = values.length
          ? (values.reduce((sum, r) => sum + r, 0) / values.length).toFixed(1)
          : 0;
        setAverageRating(avg);
        return;
      }
    } catch (error) {
      console.error('Error loading ratings from DB:', error);
    }
    // Fallback to localStorage
    const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
    const values = Object.values(ratings).filter((r) => !isNaN(r) && r > 0);
    const avg = values.length
      ? (values.reduce((sum, r) => sum + r, 0) / values.length).toFixed(1)
      : 0;
    setAverageRating(avg);
  };

  // Sync across tabs - UNCHANGED
  useEffect(() => {
    const handleStorageChange = () => {
      setLecturerReports(JSON.parse(localStorage.getItem("submittedReports")) || []);
      setProgramReports(JSON.parse(localStorage.getItem("programReports")) || []);
      setCourses(JSON.parse(localStorage.getItem("courses")) || []);

      const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
      const values = Object.values(ratings).filter((r) => !isNaN(r) && r > 0);
      const avg = values.length
        ? (values.reduce((sum, r) => sum + r, 0) / values.length).toFixed(1)
        : 0;
      setAverageRating(avg);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle logout - ADDED DATABASE CONNECTION
  const handleLogout = async () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, role }),
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }

    localStorage.removeItem("role");
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate("/");
  };

  // --- Delete Lecturer Report - ADDED DATABASE CONNECTION ---
  const handleDeleteLecturerReport = async (index) => {
    if (window.confirm("Are you sure you want to delete this lecturer report?")) {
      try {
        const report = lecturerReports[index];
        // Try to delete from database if it has an id
        if (report.id) {
          const response = await fetch(`http://localhost:5000/api/lecturer-reports/${report.id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            const updatedReports = lecturerReports.filter((_, i) => i !== index);
            setLecturerReports(updatedReports);
            localStorage.setItem("submittedReports", JSON.stringify(updatedReports));
            return;
          }
        }
        // Fallback to localStorage deletion
        throw new Error('No report ID');
      } catch (error) {
        // Fallback to localStorage
        const updatedReports = lecturerReports.filter((_, i) => i !== index);
        setLecturerReports(updatedReports);
        localStorage.setItem("submittedReports", JSON.stringify(updatedReports));
      }
    }
  };

  // --- Delete Program Report - UNCHANGED (still localStorage) ---
  const handleDeleteProgramReport = (index) => {
    if (window.confirm("Are you sure you want to delete this program report?")) {
      const updatedReports = programReports.filter((_, i) => i !== index);
      setProgramReports(updatedReports);
      localStorage.setItem("programReports", JSON.stringify(updatedReports));
    }
  };

  // --- Course Handlers - ADDED DATABASE CONNECTION ---
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleAddCourse = async () => {
    if (!courseData.courseName || !courseData.lecturerName || !courseData.className) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      // Try to save to database
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          courseCode: `CODE${Date.now()}`,
          createdBy: userId
        }),
      });

      if (response.ok) {
        const newCourse = await response.json();
        let updatedCourses = [...courses];
        if (editingCourseIndex !== null) {
          updatedCourses[editingCourseIndex] = newCourse;
        } else {
          updatedCourses.push(newCourse);
        }
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        setCourses(updatedCourses);
        handleCancelCourse();
        setShowCourseForm(false);
        return;
      }
    } catch (error) {
      console.error('Error saving course to DB:', error);
    }

    // Fallback to localStorage
    let updatedCourses = [...courses];
    if (editingCourseIndex !== null) {
      updatedCourses[editingCourseIndex] = courseData;
    } else {
      updatedCourses.push(courseData);
    }

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
    handleCancelCourse();
    setShowCourseForm(false);
  };

  const handleEditCourse = (index) => {
    setEditingCourseIndex(index);
    setCourseData(courses[index]);
    setShowCourseForm(true);
  };

  // Handle delete course - ADDED DATABASE CONNECTION
  const handleDeleteCourse = async (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const course = courses[index];
        // Try to delete from database if it has an id
        if (course.id) {
          const response = await fetch(`http://localhost:5000/api/courses/${course.id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            const updatedCourses = courses.filter((_, i) => i !== index);
            localStorage.setItem("courses", JSON.stringify(updatedCourses));
            setCourses(updatedCourses);
            return;
          }
        }
        // Fallback to localStorage deletion
        throw new Error('No course ID');
      } catch (error) {
        // Fallback to localStorage
        const updatedCourses = courses.filter((_, i) => i !== index);
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        setCourses(updatedCourses);
      }
    }
  };

  const handleCancelCourse = () => {
    setEditingCourseIndex(null);
    setCourseData({
      courseName: "",
      lecturerName: "",
      className: "",
      dateOfLecture: "",
      scheduledTime: "",
      venue: "",
    });
  };

  // --- Calculate unique lecturers ---
  const uniqueLecturers = new Set(courses.map(c => c.lecturerName)).size;

  // --- Download PDF Helpers ---
  const downloadLecturerReport = (report) => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Lecturer Report", 105, y, { align: "center" });
    y += 10;

    for (const [key, value] of Object.entries(report)) {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 10, y);
      y += 8;
      if (y > 280) { doc.addPage(); y = 10; }
    }

    doc.save(`Lecturer_Report_${report.lecturerName || "Unknown"}.pdf`);
  };

  const downloadProgramReport = (report) => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Program Report", 105, y, { align: "center" });
    y += 10;

    for (const [key, value] of Object.entries(report)) {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 10, y);
      y += 8;
      if (y > 280) { doc.addPage(); y = 10; }
    }

    doc.save(`Program_Report_${report.submittedBy || "Unknown"}.pdf`);
  };

  return (
    <div className="leader-container">
      <h2>Program Leader</h2>

      {/* Overview */}
      <div className="leader-overview">
        <div className="overview-card">
          <h3>Total Reports</h3>
          <p>{lecturerReports.length + programReports.length}</p>
        </div>
        <div className="overview-card">
          <h3>Total Courses</h3>
          <p>{courses.length}</p>
        </div>
        <div className="overview-card">
          <h3>Lecturers Managed</h3>
          <p>{uniqueLecturers}</p>
        </div>
        <div className="overview-card">
          <h3>Average Rating</h3>
          <p>{averageRating}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="leader-actions">
        <button
          className="action-btn"
          onClick={() => {
            loadLecturerReportsFromDB(); // Now loads from database
            setShowReports(!showReports);
          }}
        >
          {showReports ? "Hide Reports" : "View All Reports"}
        </button>
      </div>

      {/* Reports */}
      {showReports && (
        <div className="reports-list">
          {/* Lecturer Reports */}
          
          {lecturerReports.length === 0 ? (
            <p>No lecturer reports submitted yet.</p>
          ) : (
            lecturerReports.map((report, index) => (
              <div className="report-card" key={index}>
                {Object.entries(report).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
                <button
                  className="btn delete-btn"
                  onClick={() => handleDeleteLecturerReport(index)}
                >
                  Delete
                </button>
                <button
                  className="btn action-btn"
                  onClick={() => downloadLecturerReport(report)}
                >
                  Download PDF
                </button>
              </div>
            ))
          )}

          {/* Program Reports */}
          
          {programReports.length === 0 ? (
            <p>No program reports submitted yet.</p>
          ) : (
            programReports.map((report, index) => (
              <div className="report-card" key={index}>
                {Object.entries(report).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
                <button
                  className="btn delete-btn"
                  onClick={() => handleDeleteProgramReport(index)}
                >
                  Delete
                </button>
                <button
                  className="btn action-btn"
                  onClick={() => downloadProgramReport(report)}
                >
                  Download PDF
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Courses Table */}
      {courses.length > 0 && (
        <div className="courses-section">
          <h3 className="reports-heading" style={{ textAlign: "center", color: "navy" }}>
            Courses
          </h3>
          <table className="courses-table timetable-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Lecturer</th>
                <th>Class</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i}>
                  <td>{c.courseName}</td>
                  <td>{c.lecturerName}</td>
                  <td>{c.className}</td>
                  <td>{c.dateOfLecture}</td>
                  <td>{c.scheduledTime}</td>
                  <td>{c.venue}</td>
                  <td>
                    <button className="btn" onClick={() => handleEditCourse(i)}>Edit</button>
                    <button className="btn delete-btn" onClick={() => handleDeleteCourse(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="add-course-btn-container">
            <button className="action-btn" onClick={() => setShowCourseForm(!showCourseForm)}>
              {showCourseForm ? "Cancel Course" : "Add New Course"}
            </button>
          </div>
        </div>
      )}

      {/* Courses Form */}
      {showCourseForm && (
        <div className="program-report-form">
          <h3>{editingCourseIndex !== null ? "Edit Course" : "Add New Course"}</h3>
          <input type="text" name="courseName" placeholder="Course Name" value={courseData.courseName} onChange={handleCourseChange} className="form-control mb-2" />
          <input type="text" name="lecturerName" placeholder="Lecturer Name" value={courseData.lecturerName} onChange={handleCourseChange} className="form-control mb-2" />
          <input type="text" name="className" placeholder="Class Name" value={courseData.className} onChange={handleCourseChange} className="form-control mb-2" />
          <input type="date" name="dateOfLecture" placeholder="Date of Lecture" value={courseData.dateOfLecture} onChange={handleCourseChange} className="form-control mb-2" />
          <input type="text" name="scheduledTime" placeholder="Scheduled Time" value={courseData.scheduledTime} onChange={handleCourseChange} className="form-control mb-2" />
          <input type="text" name="venue" placeholder="Venue" value={courseData.venue} onChange={handleCourseChange} className="form-control mb-2" />
          <button className="action-btn" onClick={handleAddCourse}>
            {editingCourseIndex !== null ? "Save Changes" : "Add Course"}
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="leader-back-container">
        <button className="leader-back-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProgramLeader;