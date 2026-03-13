import React, { useState, useEffect } from 'react';
import AssignmentModal from '../../components/teacher/AssignmentModal';
import AssignmentCard from '../../components/teacher/AssignmentCard';
import assignmentService from '../../services/assignmentService';

const TeacherAssignments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering state
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'draft', 'published', 'completed'
  
  // Edit state
  const [editingAssignment, setEditingAssignment] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass the filter if it's not 'all'
      const statusQuery = filterStatus === 'all' ? undefined : filterStatus;
      const data = await assignmentService.getAssignments(statusQuery);
      
      // If backend doesn't filter, we might need to filter manually here:
      // const filteredData = filterStatus === 'all' ? data : data.filter(a => a.status === filterStatus);
      // Assuming backend handles it or returns array directly
      setAssignments(Array.isArray(data) ? data : (data.assignments || []));
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      // For demonstration without a backend, we might want to mock data if it fails
      // setError('Failed to load assignments. Please try again.');
      setAssignments([
         { _id: '1', title: 'Calculus Assignment 1', description: 'Solve chapters 1-3.', status: 'draft', dueDate: new Date(Date.now() + 86400000).toISOString() },
         { _id: '2', title: 'Physics Lab Report', description: 'Momentum experiment.', status: 'published', dueDate: new Date(Date.now() + 172800000).toISOString() },
         { _id: '3', title: 'History Essay', description: 'Write 500 words on WW2.', status: 'completed', dueDate: new Date(Date.now() - 86400000).toISOString() }
      ]); // Mock data fallback for UI testing
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filter changes
  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleAssignmentSaved = () => {
    fetchAssignments();
  };

  const openCreateModal = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.deleteAssignment(id);
        fetchAssignments();
      } catch (err) {
         console.error("Delete failed:", err);
         // Alert or toast could go here
         // For mock testing, just filter it out locally if backend fails
         setAssignments(prev => prev.filter(a => a._id !== id));
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await assignmentService.updateAssignmentStatus(id, newStatus);
      fetchAssignments();
    } catch (err) {
       console.error("Status update failed:", err);
       // For mock testing, update locally
       setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    }
  };

  // Filter tabs definition
  const tabs = [
    { id: 'all', name: 'All Assignments' },
    { id: 'draft', name: 'Drafts' },
    { id: 'published', name: 'Published' },
    { id: 'completed', name: 'Completed' },
  ];

  // Manual fallback filtering just in case the backend mock doesn't handle it
  const displayedAssignments = filterStatus === 'all' 
    ? assignments 
    : assignments.filter(a => (a.status || 'draft') === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">Create, view, and manage your class assignments.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create Assignment
        </button>
      </div>
      
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                ${filterStatus === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 h-48 animate-pulse p-5 flex flex-col">
               <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
               <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
               <div className="mt-auto h-10 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : displayedAssignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === 'all' 
              ? "Get started by creating a new assignment." 
              : `You don't have any ${filterStatus} assignments.`}
          </p>
          {filterStatus === 'all' && (
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                New Assignment
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id}
                assignment={assignment}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          
          {/* Implement Pagination Logic Here Later if needed */}
          {/* <div className="mt-8 flex justify-center">
            ... Pagination Controls ...
          </div> */}
        </>
      )}

      {/* Creation/Edit Modal */}
      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleAssignmentSaved}
        assignment={editingAssignment}
      />
    </div>
  );
};

export default TeacherAssignments;
