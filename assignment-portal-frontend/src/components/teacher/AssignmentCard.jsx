import React from 'react';

const AssignmentCard = ({ 
  assignment, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDraft = assignment.status === 'draft' || !assignment.status; // fall back if status missing
  const isPublished = assignment.status === 'published';

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2" title={assignment.title}>
            {assignment.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(assignment.status)}`}>
            {assignment.status ? assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1) : 'Draft'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {assignment.description}
        </p>
        
        <div className="text-sm text-gray-500 flex items-center mt-auto">
          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due: <span className="ml-1 font-medium text-gray-700">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end space-x-2">
        {isDraft && (
          <>
            <button 
              onClick={() => onEdit(assignment)}
              className="text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium cursor-pointer"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(assignment._id)}
              className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors font-medium cursor-pointer"
            >
              Delete
            </button>
            <button 
              onClick={() => onStatusChange(assignment._id, 'published')}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors font-medium shadow-sm cursor-pointer"
            >
              Publish
            </button>
          </>
        )}
        
        {isPublished && (
          <button 
            onClick={() => onStatusChange(assignment._id, 'completed')}
            className="text-sm px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded transition-colors font-medium shadow-sm cursor-pointer"
          >
            Mark Completed
          </button>
        )}

        {!isDraft && !isPublished && (
           <span className="text-sm text-gray-500 italic py-1.5">No actions available</span>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
