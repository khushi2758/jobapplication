import api from "./api";

export interface Job {
    _id: string;
    title: string;
    track: string;
    requiredSkills: string[];
    description?: string;
    isOpen: boolean;
}

export const getAllJobs = async (): Promise<Job[]> => {
    const response = await api.get("/jobs");
    return response.data.jobs;
};

export const getJobById = async (jobId: string): Promise<Job> => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data.job;
};