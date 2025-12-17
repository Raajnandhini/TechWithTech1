import axios from 'axios';

const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const signup = (data) => api.post('/signup', data);
export const login = (data) => api.post('/login', data);
export const resetPassword = (data) => api.post('/reset-password', data);

export const getRequests = (party_id) => api.get(`/requests/${party_id}`);
export const createRequest = (data) => api.post('/requests/create', data);

export const getDonations = (party_id) => api.get(`/donations/${party_id}`);
export const createDonation = (data) => api.post('/donations/create', data);

export const getAvailableDonations = () => api.get('/donations/available');
export const findMatchingDonations = (type) => api.get(`/matches/donations/${type}`);
export const findMatchingRequests = (type) => api.get(`/matches/requests/${type}`);
export const executeMatch = (data) => api.post('/transact/match', data);