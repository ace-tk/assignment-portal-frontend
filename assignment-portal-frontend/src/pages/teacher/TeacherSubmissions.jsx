import React, { useState, useEffect } from 'react';
import submissionService from '../../services/submissionService';
import assignmentService from '../../services/assignmentService';

const TeacherSubmissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch all Published & Completed assignments for the dropdown list
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignments();
        const assignmentsData = Array.isArray(data) ? data : (data.assignments || []);
        // Only show assignments students could have submitted to
        const filterableAttrs = ['published', 'completed'];
        const viewableAssignments = assignmentsData.filter(a => filterableAttrs.includes(a.status));
        setAssignments(viewableAssignments);
        
        // Auto-select the first one if available
        if (viewableAssignments.length > 0) {
           setSelectedAssignmentId(viewableAssignments[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch assignments for submissions view:", err);
        // Fallback Mock Data
        setAssignments([
           { _id: '2', title: 'Physics Lab Report', status: 'published' },
           { _id: '3', title: 'History Essay', status: 'completed' }
        ]);
        setSelectedAssignmentId('2');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // 2. Fetch submissions when an assignment is selected
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignmentId) {
         setSubmissions([]);
         return;
      }

      try {
        setLoadingSubmissions(true);
        const data = await submissionService.getSubmissionsByAssignment(selectedAssignmentId);
        setSubmissions(Array.isArray(data) ? data : (data.submissions || []));
      } catch (err) {
        console.error(`Failed to fetch submissions for ${selectedAssignmentId}:`, err);
        // MOCK DATA for layout testing
        setTimeout(() => {
           setSubmissions([
             { _id: 's1', student: { name: 'Alice Smith', email: 'alice@student.com' }, answer: 'Here is my lab report conclusion: Momentum is conserved.', submittedAt: new Date().toISOString(), isReviewed: false },
             { _id: 's2', student: { name: 'Bob Jones', email: 'bob@student.com' }, answer: 'I performed the experiment but my data was skewed due to friction.', submittedAt: new Date(Date.now() - 3600000).toISOString(), isReviewed: true },
             { _id: 's3', student: { name: 'Charlie Brown', email: 'charlie@student.com' }, answer: 'Attached link to Google Doc.', submittedAt: new Date(Date.now() - 7200000).toISOString(), isReviewed: false }
           ]);
           setLoadingSubmissions(false);
        }, 500);
        return; // Early return to let setTimeout run
      }
      setLoadingSubmissions(false);
    };

    fetchSubmissions();
  }, [selectedAssignmentId]);

  const handleReviewToggle = async (submissionId, currentReviewedState) => {
     try {
       // Optimistic UI Update
       setSubmissions(prev => prev.map(sub => 
         sub._id === submissionId ? { ...sub, isReviewed: !currentReviewedState } : sub
       ));
       await submissionService.reviewSubmission(submissionId, { isReviewed: !currentReviewedState });
     } catch (err) {
       console.error("Failed to update review status:", err);
       // Revert Optimistic Update
       setSubmissions(prev => prev.map(sub => 
         sub._id === submissionId ? { ...sub, isReviewed: currentReviewedState } : sub
       ));
       alert("Failed to update review status. Please try again.");
     }
  };

  const selectedAssignmentTitle = assignments.find(a => a._id === selectedAssignmentId)?.title || '';
  
  // Analytics variables
  const totalSubmissions = submissions.length;
  const reviewedCount = submissions.filter(s => s.isReviewed).length;
  const pendingCount = totalSubmissions - reviewedCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
          <p className="text-sm text-gray-500 mt-1">Review and grade answers submitted by students.</p>
        </div>
        
        {/* Assignment Selector */}
        <div className="w-full sm:w-auto">
           <label htmlFor="assignment-select" className="sr-only">Select Assignment</label>
           <select
              id="assignment-select"
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              disabled={loading || assignments.length === 0}
              className="mt-1 block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border shadow-sm"
           >
              {loading ? (
                 <option>Loading assignments...</option>
              ) : assignments.length === 0 ? (
                 <option>No published assignments found</option>
              ) : (
                 assignments.map(a => (
                    <option key={a._id} value={a._id}>
                       {a.title} ({a.status})
                    </option>
                 ))
              )}
           </select>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
           <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
        </div>
      ) : selectedAssignmentId === '' ? (
         <div className="bg-white shadow rounded-lg p-8 text-center border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No Assignment Selected</h3>
            <p className="mt-1 text-gray-500">Please choose an assignment from the dropdown above to view its submissions.</p>
         </div>
      ) : (
        <>
          {/* Analytics Summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{loadingSubmissions ? '-' : totalSubmissions}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border border-green-50 border-l-4 border-l-green-400">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-green-600 truncate">Reviewed</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{loadingSubmissions ? '-' : reviewedCount}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border border-yellow-50 border-l-4 border-l-yellow-400">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-yellow-600 truncate">Pending Review</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{loadingSubmissions ? '-' : pendingCount}</dd>
              </div>
            </div>
          </div>

          {/* Submissions Table List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
             <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                   Submissions for: <span className="font-bold text-blue-700">{selectedAssignmentTitle}</span>
                </h3>
             </div>
             
             {loadingSubmissions ? (
                <div className="p-8 text-center text-gray-500">
                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                   <p>Loading submissions...</p>
                </div>
             ) : submissions.length === 0 ? (
                <div className="p-12 text-center">
                   <p className="text-gray-500 text-lg">No one has submitted answers for this assignment yet.</p>
                </div>
             ) : (
                <ul className="divide-y divide-gray-200">
                  {submissions.map((sub) => (
                     <li key={sub._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                           <div className="flex-1 pr-4">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {sub.student?.name || 'Unknown Student'}
                                 </h4>
                                 <div className="ml-2 flex-shrink-0 flex">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.isReviewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {sub.isReviewed ? 'Reviewed' : 'Pending'}
                                    </span>
                                 </div>
                              </div>
                              <div className="mt-1 sm:flex sm:justify-between">
                                 <div className="sm:flex">
                                    <p className="text-xs text-gray-500">
                                       {sub.student?.email || 'No email'}
                                    </p>
                                 </div>
                                 <div className="mt-2 text-xs flex items-center text-gray-500 sm:mt-0">
                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>
                                      Submitted: {new Date(sub.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                              </div>
                              
                              <div className="mt-4">
                                 <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100 whitespace-pre-wrap">
                                    {sub.answer}
                                 </p>
                              </div>
                           </div>

                           {/* Review Actions Context */}
                           <div className="ml-4 mt-2 flex-shrink-0">
                              {sub.isReviewed ? (
                                <button
                                   onClick={() => handleReviewToggle(sub._id, sub.isReviewed)}
                                   className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none underline decoration-gray-300 hover:decoration-gray-500 transition"
                                >
                                   Mark Unreviewed
                                </button>
                              ) : (
                                <button
                                   onClick={() => handleReviewToggle(sub._id, sub.isReviewed)}
                                   className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                                >
                                   Mark as Reviewed
                                </button>
                              )}
                           </div>
                        </div>
                     </li>
                  ))}
                </ul>
             )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherSubmissions;
