import api from './api';

const assignmentService = {
  /**
   * Get all assignments (Teacher view might want all, Student might want published)
   * The backend should handle filtering based on role/query params.
   */
  getAssignments: async (status) => {
    let url = '/assignments';
    if (status) {
      url += `?status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get a single assignment by ID
   */
  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Create a new assignment
   */
  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  /**
   * Update an existing assignment (only Drafts usually)
   */
  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  /**
   * Delete an assignment (only Drafts usually)
   */
  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Update assignment status (e.g., Publish, Complete)
   */
  updateAssignmentStatus: async (id, status) => {
    // Some APIs might use PATCH or PUT for this. Adjust as needed for your backend.
    const response = await api.patch(`/assignments/${id}/status`, { status });
    return response.data;
  }
};

export default assignmentService;
