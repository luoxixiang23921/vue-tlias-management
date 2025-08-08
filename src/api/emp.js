import request from '@/utils/request';

// Find all departments
export const queryPage = (name, gender, begin, end, page, pageSize) => {
  return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
}

export const findById = (id) => {
  return request.get(`/emps/${id}`);
}

export const addEmp = (emp) => {
  return request.post('/emps', emp);
}

// Edit Employee's Info
export const updateEmp = (emp) => {
  return request.put(`/emps`, emp);
}

//batch delete employees
export const deletebyIds = (ids) => {
  return request.delete(`/emps?ids=${ids}`);
}