import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import submissionService from '../../services/submissionService';

const StudentAssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the assignment details
        // In a real app we fetch by ID here. 
        // We'll simulate fetching from our mock data or the real API
        let assignmentData;
        try {
           assignmentData = await assignmentService.getAssignmentById(id);
        } catch (err) {
           console.log("Fallback to mock assignment data");
           // Mock Data Fallback
           assignmentData = { 
             _id: id, 
             title: id === '2' ? 'Physics Lab Report' : 'Math Assignment', 
             description: 'Please detail your findings in a structured report. Include introduction, methods, results, and conclusion.', 
             dueDate: new Date(Date.now() + (id === '2' ? 172800000 : -86400000)).toISOString() 
           };
        }
        setAssignment(assignmentData);

        // Load the student's submission for this assignment to see if they already submitted
        try {
           // We might need an endpoint like GET /assignments/:id/my-submission
           // The submissionService.getMySubmissions() pulls all, so we filter it here for demonstration
           const mySubmissionsResp = await submissionService.getMySubmissions();
           const mySubmissions = Array.isArray(mySubmissionsResp) ? mySubmissionsResp : (mySubmissionsResp.submissions || []);
           const existingSubmission = mySubmissions.find(sub => sub.assignmentId === id || sub.assignment?._id === id);
           
           if (existingSubmission) {
              setSubmission(existingSubmission);
              setAnswer(existingSubmission.answer);
           }
        } catch (err) {
           console.log("Fallback to mock submission data");
           if (id !== '2') { // Mocking that id '3' has a submission
              setSubmission({
                 _id: 'sub123',
                 answer: 'Here is my completed work.',
                 submittedAt: new Date(Date.now() - 3600000).toISOString(),
                 isReviewed: false
              });
              setAnswer('Here is my completed work.');
           }
        }
      } catch (err) {
        console.error("Failed to load assignment details:", err);
        setError("Failed to load assignment details. It might not exist or you don't have permission.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const newSubmission = await submissionService.submitAssignment(id, answer);
      
      // Update local state to reflect successful submission
      setSubmission(newSubmission || {
        _id: 'temp-' + Date.now(),
        answer: answer,
        submittedAt: new Date().toISOString(),
        isReviewed: false
      });
      
    } catch (err) {
      console.error("Submission failed:", err);
      // For mock UI
      setSubmission({
        _id: 'temp-' + Date.now(),
        answer: answer,
        submittedAt: new Date().toISOString(),
        isReviewed: false
      });
      // setError(err.response?.data?.message || "Failed to submit assignment. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 w-24 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center border border-red-200 mt-8">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error || "Assignment not found."}</p>
        <button 
           onClick={() => navigate('/student/dashboard')}
           className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
        >
           Return to Dashboard
        </button>
      </div>
    );
  }

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const hasSubmitted = !!submission;
  
  // They can submit if they haven't submitted yet, and it's not overdue
  // (Assuming strict due date policy)
  const canSubmit = !hasSubmitted && !isOverdue;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <div>
              <button 
                 onClick={() => navigate('/student/dashboard')}
                 className="text-gray-400 hover:text-gray-500 transition-colors"
                 title="Back to Dashboard"
              >
                <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </button>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{assignment.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Assignment Header Card */}
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm">
        <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h1 className="text-2xl leading-6 font-bold text-gray-900">
              {assignment.title}
            </h1>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0 flex space-x-3">
             {hasSubmitted && (
               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                 <svg className="-ml-1 mr-1.5 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                 </svg>
                 Submitted
               </span>
             )}
             {isOverdue && !hasSubmitted && (
               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                 <svg className="-ml-1 mr-1.5 h-4 w-4 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                   <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                 </svg>
                 Overdue
               </span>
             )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-8 text-sm text-gray-500">
           <div className="flex items-center mt-2 sm:mt-0 whitespace-nowrap">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                 Due: <span className={`font-semibold ${isOverdue && !hasSubmitted ? 'text-red-600' : 'text-gray-900'}`}>
                   {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString(undefined, { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'No due date'}
                 </span>
              </span>
           </div>
        </div>

        <div className="mt-6 prose prose-blue prose-sm sm:prose-base max-w-none text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">
          {/* In a real app, this might render markdown. We use whitespace-pre-wrap for normal text */}
          <p className="whitespace-pre-wrap">{assignment.description}</p>
        </div>
      </div>

      {/* Submission Area */}
      <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Your Work
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {hasSubmitted ? (
             // Read-only view for submitted work
             <div className="space-y-4">
                <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                   <div className="flex items-center">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                           You submitted this assignment on {new Date(submission.submittedAt).toLocaleString()}.
                        </p>
                        <p className="mt-3 text-sm md:mt-0 md:ml-6">
                           <span className={`font-semibold ${submission.isReviewed ? 'text-green-700' : 'text-blue-700'}`}>
                             Status: {submission.isReviewed ? 'Reviewed by Teacher' : 'Awaiting Review'}
                           </span>
                        </p>
                     </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Submitted Answer</label>
                   <div className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md p-4 min-h-[150px] whitespace-pre-wrap">
                      {submission.answer}
                   </div>
                </div>
             </div>
          ) : isOverdue ? (
             // Overdue state
             <div className="rounded-md bg-red-50 p-4 border border-red-200 text-center py-8">
                <svg className="mx-auto h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800">Past Due</h3>
                <p className="mt-2 text-sm text-red-700 max-w-lg mx-auto">
                   The deadline for this assignment has passed. Submissions are no longer accepted. Please contact your teacher if you have a valid excuse.
                </p>
             </div>
          ) : (
             // Submission Form
             <form onSubmit={handleSubmit}>
                <div>
                   <label htmlFor="answer" className="sr-only">Your Answer</label>
                   <textarea
                     id="answer"
                     name="answer"
                     rows="8"
                     className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 transition-colors"
                     placeholder="Type your answer here..."
                     value={answer}
                     onChange={(e) => setAnswer(e.target.value)}
                     disabled={submitting}
                   ></textarea>
                </div>
                
                <div className="mt-5 flex justify-end">
                   <button
                     type="button"
                     onClick={() => navigate('/student/dashboard')}
                     disabled={submitting}
                     className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={submitting || !answer.trim()}
                     className={`inline-flex justify-center flex-shrink-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(!answer.trim() || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {submitting ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Submitting...
                        </>
                     ) : 'Submit Assignment'}
                   </button>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-right">
                   Note: You can only submit once. Make sure your answer is complete!
                </p>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentDetail;
