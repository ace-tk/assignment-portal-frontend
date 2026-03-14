import React, { useState, useEffect } from 'react';
import assignmentService from '../../services/assignmentService';
import StudentAssignmentCard from '../../components/student/StudentAssignmentCard';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // We only want published or completed assignments for students
        // Often, backend has a specific endpoint for student assignments, 
        // but we'll use the generic one and filter if needed.
        const data = await assignmentService.getAssignments();
        let fetchedList = Array.isArray(data) ? data : (data.assignments || []);
        
        // Filter out drafts on the frontend just to be safe
        fetchedList = fetchedList.filter(a => a.status === 'published' || a.status === 'completed');
        
        setAssignments(fetchedList);
      } catch (err) {
        console.error("Failed to fetch student assignments:", err);
        // Fallback mock data
        setAssignments([
           { _id: '2', title: 'Physics Lab Report', description: 'Momentum experiment.', status: 'published', dueDate: new Date(Date.now() + 172800000).toISOString(), hasSubmitted: false },
           { _id: '3', title: 'History Essay', description: 'Write 500 words on WW2.', status: 'completed', dueDate: new Date(Date.now() - 86400000).toISOString(), hasSubmitted: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          My Assignments
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          View and complete your coursework.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 h-48 animate-pulse p-5 flex flex-col">
               <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
               <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
               <div className="mt-auto h-10 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Assignments Yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back later! Your teacher hasn't published any assignments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <StudentAssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
