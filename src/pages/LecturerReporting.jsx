import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LecturerReporting.css";

const LecturerReporting = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyName: "",
    className: "",
    weekOfReporting: "",
    dateOfLecture: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    actualStudents: "",
    totalRegistered: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    recommendations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID for editing purposes
    const reportWithId = { ...formData, id: Date.now() };

    // --- Update Lecturer Reports ---
    const lecturerReports = JSON.parse(localStorage.getItem("lecturerReports")) || [];
    lecturerReports.push(reportWithId);
    localStorage.setItem("lecturerReports", JSON.stringify(lecturerReports));

    // --- Update Principal Lecturer Reports ---
    const principalReports = JSON.parse(localStorage.getItem("submittedReports")) || [];
    principalReports.push(reportWithId);
    localStorage.setItem("submittedReports", JSON.stringify(principalReports));

    alert("Report submitted successfully!");
    navigate("/lecturer"); // go back to dashboard
  };

  return (
    <div className="report-container">
      <h2 className="page-title">Lecturer Reporting Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="facultyName" placeholder="Faculty Name" value={formData.facultyName} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="className" placeholder="Class Name" value={formData.className} onChange={handleChange} className="form-control mb-2" required />
        <input type="week" name="weekOfReporting" value={formData.weekOfReporting} onChange={handleChange} className="form-control mb-2" required />
        <input type="date" name="dateOfLecture" value={formData.dateOfLecture} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="courseName" placeholder="Course Name" value={formData.courseName} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="courseCode" placeholder="Course Code" value={formData.courseCode} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="lecturerName" placeholder="Lecturer Name" value={formData.lecturerName} onChange={handleChange} className="form-control mb-2" required />
        <input type="number" name="actualStudents" placeholder="Actual Number of Students Present" value={formData.actualStudents} onChange={handleChange} className="form-control mb-2" required />
        <input type="number" name="totalRegistered" placeholder="Total Number of Registered Students" value={formData.totalRegistered} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="venue" placeholder="Venue of the Class" value={formData.venue} onChange={handleChange} className="form-control mb-2" required />
        <input type="time" name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="topicTaught" placeholder="Topic Taught" value={formData.topicTaught} onChange={handleChange} className="form-control mb-2" required />
        <textarea name="learningOutcomes" placeholder="Learning Outcomes of the Topic" value={formData.learningOutcomes} onChange={handleChange} className="form-control mb-2" required></textarea>
        <textarea name="recommendations" placeholder="Lecturer’s Recommendations" value={formData.recommendations} onChange={handleChange} className="form-control mb-2" required></textarea>

        <div className="buttons-row">
          <button type="submit" className="btn">Submit Report</button>
          <button type="button" className="btn" onClick={() => navigate("/lecturer")}>
            Back 
          </button>
        </div>
      </form>
    </div>
  );
};

export default LecturerReporting;
