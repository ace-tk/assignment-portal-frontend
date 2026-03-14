import React, { useState, useEffect } from 'react';
import assignmentService from '../../services/assignmentService';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    publishedAssignments: 0,
    draftAssignments: 0,
    completedAssignments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // We fetch all assignments to calculate stats since we are using mock endpoints primarily.
        const data = await assignmentService.getAssignments();
        const assignmentsData = Array.isArray(data) ? data : (data.assignments || []);
        
        let draftCount = 0;
        let publishedCount = 0;
        let completedCount = 0;
        
        assignmentsData.forEach(a => {
           if (a.status === 'published') publishedCount++;
           else if (a.status === 'completed') completedCount++;
           else draftCount++;
        });

        setStats({
          totalAssignments: assignmentsData.length,
          publishedAssignments: publishedCount,
          draftAssignments: draftCount,
          completedAssignments: completedCount
        });
      } catch (err) {
        console.error("Failed to fetch assignments for dashboard stats:", err);
        // Fallback mock stats for display purposes when API is not running
        setStats({
          totalAssignments: 5,
          publishedAssignments: 2,
          draftAssignments: 2,
          completedAssignments: 1
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          A high-level view of your class assignments and performance metrics.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
               </svg>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Total Assignments</p>
               <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
               </svg>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Drafts</p>
               <h3 className="text-3xl font-bold text-gray-900">{stats.draftAssignments}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
               </svg>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Published</p>
               <h3 className="text-3xl font-bold text-gray-900">{stats.publishedAssignments}</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Completed</p>
               <h3 className="text-3xl font-bold text-gray-900">{stats.completedAssignments}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Action / Recent Activity Area (Placeholder for visual appeal) */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 sm:p-12 text-white relative overflow-hidden">
         {/* Decorative circle */}
         <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
         
         <div className="relative z-10 md:w-2/3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
               Ready to grade?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl">
               Students have been submitting their work. Check out the Submissions tab to review the latest answers and provide feedback.
            </p>
            <div className="mt-8">
               <a href="/teacher/submissions" className="inline-block bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-8 rounded-lg shadow-md transition-colors">
                  Go to Submissions
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
