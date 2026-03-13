import React from 'react';
import { Link } from 'react-router-dom';

const StudentAssignmentCard = ({ assignment }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  // We determine if submitted usually by joining submission data, let's assume it's passed or available
  const hasSubmitted = assignment.hasSubmitted || false;

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow transition-colors duration-200 overflow-hidden flex flex-col h-full relative">
      
      {/* Decorative top border color based on status */}
      <div className={`h-1 w-full ${hasSubmitted ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}></div>

      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2" title={assignment.title}>
            {assignment.title}
          </h3>
          
          {hasSubmitted ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
               Submitted
            </span>
          ) : isOverdue ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
               Overdue
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
               Pending
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {assignment.description}
        </p>
        
        <div className={`text-sm flex items-center mt-auto ${isOverdue && !hasSubmitted ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          <svg className="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Due: <span className="ml-1">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <Link 
          // Link navigates to the detailed view using the assignment ID (Task 10)
          to={`/student/assignment/${assignment._id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          {hasSubmitted ? 'View Submission' : 'View Assignment'}
        </Link>
      </div>
    </div>
  );
};

export default StudentAssignmentCard;
