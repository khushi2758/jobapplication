
import api from "./api";

export interface ApplicationPayload {
  name: string;
  email: string;
  resumeText: string;
  jobId: string;
}

export interface ApplicationResult {
  id: string;
  name: string;
  email: string;
  job: {
    id: string;
    title: string;
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
}

interface ApplicationResponse {
  success: boolean;
  message: string;
  application: ApplicationResult;
}

export const submitApplication = async (
  payload: ApplicationPayload
): Promise<ApplicationResponse> => {
  const response = await api.post("/applications", payload);
  return response.data;
};
