import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Lecturer.css";

function Lecturer() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    rating: 0,
    totalStudents: 0,
  });

  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showTimetable, setShowTimetable] = useState(false);

  // Timetable (still here for now)
  const timetable = [
    { day: "Monday", course: "Web Application", time: "08:30 - 10:30" },
    { day: "Tuesday", course: "Java OOP", time: "08:30 - 10:30" },
    { day: "Wednesday", course: "Financial Accounting", time: "08:30 - 10:30" },
    { day: "Thursday", course: "Data Communication", time: "08:30 - 10:30" },
    { day: "Friday", course: "Concept of Organisation", time: "08:30 - 10:30" },
    { day: "Friday", course: "Digital Market", time: "10:30 - 12:30" },
  ];

  // Load stats & reports - ADDED DATABASE CONNECTION
  useEffect(() => {
    setStats((prev) => ({ ...prev, totalCourses: timetable.length }));

    // Load ratings - ADDED DATABASE CONNECTION
    loadRatingsFromDB();

    // Load reports - ADDED DATABASE CONNECTION
    loadReportsFromDB();

    // Sync reports across tabs
    const handleStorageChange = () => {
      const updatedReports = JSON.parse(localStorage.getItem("lecturerReports")) || [];
      setReports(updatedReports);
      updateTotalStudents(updatedReports);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // NEW: Load ratings from database
  const loadRatingsFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const values = data.filter(r => r.rating).map(r => r.rating);
        const avgRating = values.length
          ? (values.reduce((sum, r) => sum + r, 0) / values.length).toFixed(1)
          : 0;
        setStats((prev) => ({ ...prev, rating: avgRating }));
        return;
      }
    } catch (error) {
      console.error('Error loading ratings from DB:', error);
    }
    // Fallback to localStorage
    const allRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    const values = Object.values(allRatings).filter((r) => !isNaN(r) && r > 0);
    const avgRating = values.length
      ? (values.reduce((sum, r) => sum + r, 0) / values.length).toFixed(1)
      : 0;
    setStats((prev) => ({ ...prev, rating: avgRating }));
  };

  // NEW: Load reports from database
  const loadReportsFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lecturer-reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
        updateTotalStudents(data);
        return;
      }
    } catch (error) {
      console.error('Error loading reports from DB:', error);
    }
    // Fallback to localStorage
    const savedReports = JSON.parse(localStorage.getItem("lecturerReports")) || [];
    setReports(savedReports);
    updateTotalStudents(savedReports);
  };

  // Update total students - UNCHANGED
  const updateTotalStudents = (reportsList) => {
    const total = reportsList.reduce(
      (sum, r) => sum + (parseInt(r.totalRegistered, 10) || 0),
      0
    );
    setStats((prev) => ({ ...prev, totalStudents: total }));
  };

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

  const handleEdit = (report) => {
    setEditingId(report.id);
    setEditData({ ...report });
  };

  // Handle save - ADDED DATABASE CONNECTION
  const handleSave = async () => {
    try {
      // Try to save to database
      const response = await fetch(`http://localhost:5000/api/lecturer-reports/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        const updatedReports = reports.map((r) =>
          r.id === editingId ? updatedReport : r
        );
        setReports(updatedReports);
        localStorage.setItem("lecturerReports", JSON.stringify(updatedReports));
        updateTotalStudents(updatedReports);
        setEditingId(null);
        setEditData({});
        return;
      }
    } catch (error) {
      console.error('Error updating report in DB:', error);
    }

    // Fallback to localStorage
    const updatedReports = reports.map((r) =>
      r.id === editingId ? editData : r
    );
    setReports(updatedReports);
    localStorage.setItem("lecturerReports", JSON.stringify(updatedReports));
    updateTotalStudents(updatedReports);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // 🔴 Delete Report - ADDED DATABASE CONNECTION
  const handleDelete = async (id) => {
    try {
      // Try to delete from database
      const response = await fetch(`http://localhost:5000/api/lecturer-reports/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedReports = reports.filter((r) => r.id !== id);
        setReports(updatedReports);
        localStorage.setItem("lecturerReports", JSON.stringify(updatedReports));
        updateTotalStudents(updatedReports);
        return;
      }
    } catch (error) {
      console.error('Error deleting report from DB:', error);
    }

    // Fallback to localStorage
    const updatedReports = reports.filter((r) => r.id !== id);
    setReports(updatedReports);
    localStorage.setItem("lecturerReports", JSON.stringify(updatedReports));
    updateTotalStudents(updatedReports);

    // Also update for principalLecturer
    localStorage.setItem("principalReports", JSON.stringify(updatedReports));
  };

  return (
    <div className="lecturer-container">
      <h2>Lecturer </h2>

      {/* Stats Overview */}
      <div className="lecturer-overview">
        <div className="overview-card">
          <h3>Total Courses</h3>
          <p>{stats.totalCourses}</p>
        </div>
        <div className="overview-card">
          <h3>Rating</h3>
          <p>{stats.rating}</p>
        </div>
        <div className="overview-card">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="lecturer-actions">
        <button className="btn" onClick={() => navigate("/lecturer/report")}>
          Submit Report
        </button>
        <button
          className="btn"
          onClick={() => {
            loadReportsFromDB(); // Now loads from database
            setShowReports(!showReports);
          }}
        >
          {showReports ? "Hide Reports" : "View Reports"}
        </button>
        <button className="btn" onClick={() => setShowTimetable(!showTimetable)}>
          {showTimetable ? "Hide Timetable" : "View Timetable"}
        </button>
      </div>

      {/* Timetable */}
      {showTimetable && (
        <div className="timetable">
          <h3>Lecturer Timetable</h3>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Course</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, index) => (
                <tr key={index}>
                  <td>{slot.day}</td>
                  <td>{slot.course}</td>
                  <td>{slot.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports List */}
      {showReports && (
        <div className="reports-list">
          {reports.length === 0 ? (
            <p>No reports submitted yet.</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className={`report-card ${editingId === report.id ? "editable" : ""}`}>
                {editingId === report.id ? (
                  <div className="report-edit">
                    {Object.keys(report).map((key) =>
                      key !== "id" ? (
                        <input
                          key={key}
                          type={key.includes("Students") || key.includes("Number") ? "number" : "text"}
                          value={editData[key]}
                          onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                          placeholder={key}
                        />
                      ) : null
                    )}
                    <div className="edit-buttons">
                      <button className="btn" onClick={handleSave}>Save</button>
                      <button className="btn" onClick={handleCancel}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="report-view">
                    <p><strong>Faculty Name:</strong> {report.facultyName}</p>
                    <p><strong>Class Name:</strong> {report.className}</p>
                    <p><strong>Week of Reporting:</strong> {report.weekOfReporting}</p>
                    <p><strong>Date of Lecture:</strong> {report.dateOfLecture}</p>
                    <p><strong>Course Name:</strong> {report.courseName}</p>
                    <p><strong>Course Code:</strong> {report.courseCode}</p>
                    <p><strong>Lecturer Name:</strong> {report.lecturerName}</p>
                    <p><strong>Actual Students Present:</strong> {report.actualStudents}</p>
                    <p><strong>Total Students Registered:</strong> {report.totalRegistered}</p>
                    <p><strong>Venue:</strong> {report.venue}</p>
                    <p><strong>Scheduled Time:</strong> {report.scheduledTime}</p>
                    <p><strong>Topic Taught:</strong> {report.topicTaught}</p>
                    <p><strong>Learning Outcomes:</strong> {report.learningOutcomes}</p>
                    <p><strong>Recommendations:</strong> {report.recommendations}</p>

                    <button className="btn" onClick={() => handleEdit(report)}>Edit</button>
                    {/* 🔴 Delete button added */}
                    <button className="btn delete-btn" onClick={() => handleDelete(report.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Logout */}
      <div className="lecturer-back-container">
        <button className="btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Lecturer;