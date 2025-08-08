import request from '@/utils/request';

// Find all departments
export const findAll = () => request.get('/depts');

// Find by Id
export const findById = (id) => request.get(`/depts/${id}`);

// Adding departments
export const add = (dept) => request.post('/depts', dept);

// Editing departments
export const update = (dept) => request.put('/depts', dept);

//Deleting departments
export const deleteById = (id) => request.delete(`/depts?id=${id}`);