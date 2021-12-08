import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export async function getAllReviews(user_id, type, status) {
  return axios.get(`${url}/reviews`, {
    params: { user_id, type, status },
  });
}

export async function getReview(peerReviewId, userId) {
  return axios.get(`${url}/reviews/${peerReviewId}`, { params: { user_id: userId } });
}

export async function updateReview(id, body) {
  const request = await axios.put(`${url}/reviews/${id}`, body);
  return request;
}

export async function createRequest(details) {
  const data = {
    reviewee_id: details.user.id,
    reviewer_id: details.reviewer.id,
    reason: details.reason,
    course: details.course,
    course_description: details.course_description,
    aspect_comments: details.aspects,
    status: details.status,
  };

  return axios.post(`${url}/reviews`, data);
}

export async function updateRequest(details) {
  const data = {
    reviewee_id: details.user.id,
    reviewer_id: details.reviewer.id,
    reason: details.reason,
    course: details.course,
    course_description: details.course_description,
    aspect_comments: details.aspects,
    status: details.status,
    id: details.id,
  };

  await axios.put(`${url}/reviews`, data);
}

export async function deleteRequest(id) {
  await axios.delete(`${url}/reviews/${id}`);
}

export async function getRequest(id) {
  const request = axios.get(`${url}/reviews/${id}`);
  return request;
}

export async function createReview(details) {
  const data = {
    aspects: details.aspects,
    status: details.status,
    prompts: details.prompts,
  };
  await axios.put(`${url}/reviews/aspects/${details.peer_review_id}`, data);
}

export async function getAspects() {
  return axios.get(`${url}/aspects`);
}

export function getGuidedPrompts() {
  return axios.get(`${url}/prompts`);
}

export function getUsers() {
  return axios.get(`${url}/users`);
}

export function login(upi) {
  return axios.get(`${url}/login`, { params: { upi } });
}
