import React, { useState } from 'react';
import AssignmentModal from '../../components/teacher/AssignmentModal';

const TeacherAssignments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In later tasks we will fetch and display actual assignments here
  const handleAssignmentSaved = () => {
    console.log("Assignment saved! Refresh the list here in the future.");
    // Fetch assignments...
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Assignments</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
        >
          Create Assignment
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Assignment list will appear here in Task 7.</p>
        
        {/* Placeholder for Edit/Delete buttons to demonstrate functionality for Task 6 */}
        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
           <h3 className="font-semibold text-blue-800">Task 6 Demonstration Area</h3>
           <p className="text-sm text-blue-600 mb-2">The "Create Assignment" button opens the form modal we built.</p>
           <p className="text-sm text-blue-600">The `assignmentService.js` file now contains the Create/Edit/Delete APIs.</p>
        </div>
      </div>

      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleAssignmentSaved}
        // To test editing, you could pass a dummy assignment object here like:
        // assignment={{ _id: '123', title: 'Test', description: 'Desc', dueDate: new Date().toISOString() }}
      />
    </div>
  );
};

export default TeacherAssignments;
