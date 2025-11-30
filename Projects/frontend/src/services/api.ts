import axios from 'axios';
import type { Property, Land, Project } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>('/properties');
  return response.data;
};

export const getProperty = async (id: string): Promise<Property> => {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
};

// Lands API
export const getLands = async (): Promise<Land[]> => {
  const response = await api.get<Land[]>('/lands');
  return response.data;
};

export const getLand = async (id: string): Promise<Land> => {
  const response = await api.get<Land>(`/lands/${id}`);
  return response.data;
};

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export default api;
