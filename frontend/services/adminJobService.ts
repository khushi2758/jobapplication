
import api from "./api";
import type { Job } from "./jobService";

export interface JobPayload {
  title: string;
  track: string;
  description: string;
  requiredSkills: string[];
  isOpen: boolean;
}

// Create a new job
export const createJob = async (
  payload: JobPayload
): Promise<Job> => {
  const response = await api.post("/jobs", payload);

  return response.data.job;
};

// Update an existing job
export const updateJob = async (
  jobId: string,
  payload: Partial<JobPayload>
): Promise<Job> => {
  const response = await api.put(`/jobs/${jobId}`, payload);

  return response.data.job;
};
