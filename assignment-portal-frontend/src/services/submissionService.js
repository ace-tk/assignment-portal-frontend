import api from './api';

const submissionService = {
  /**
   * Get all submissions for a specific assignment (Teacher's perspective)
   */
  getSubmissionsByAssignment: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  /**
   * Mark a submission as reviewed and optionally provide feedback (Teacher's perspective)
   */
  reviewSubmission: async (submissionId, reviewData) => {
    const response = await api.patch(`/submissions/${submissionId}/review`, reviewData);
    return response.data;
  },

  /**
   * Create a new submission (Student's perspective - for Task 10)
   */
  submitAssignment: async (assignmentId, answer) => {
    const response = await api.post(`/assignments/${assignmentId}/submissions`, { answer });
    return response.data;
  },

  /**
   * Get submission history for the logged-in student (Student's perspective - for Task 9/10)
   */
  getMySubmissions: async () => {
    const response = await api.get('/submissions/me');
    return response.data;
  }
};

export default submissionService;
