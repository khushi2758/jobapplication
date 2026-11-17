
import api from "./api";

export interface AdminApplication {
  _id: string;
  name: string;
  email: string;
  resumeText: string;
  jobId: {
    _id: string;
    title: string;
    track: string;
    requiredSkills: string[];
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  createdAt: string;
}

interface ApplicationsResponse {
  success: boolean;
  count: number;
  applications: AdminApplication[];
}

// Fetch all applications, optionally filtered by job
export const getApplications = async (
  jobId?: string
): Promise<AdminApplication[]> => {
  const response = await api.get<ApplicationsResponse>(
    "/admin/applications",
    {
      params: jobId ? { job_id: jobId } : {},
    }
  );

  return response.data.applications;
};
