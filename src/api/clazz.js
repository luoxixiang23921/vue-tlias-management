import request from '@/utils/request';

// List all classes
export const listClazzs = () => {
  return request.get('/clazzs/list');
}

export const findById = (id) => request.get(`/clazzs/${id}`);

export const queryPage = (name, begin, end, page, pageSize) => {
  return request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
}

// // Adding Classes
export const add = (clazz) => request.post('/clazzs', clazz);

// Editing Classes
export const updateClazz = (clazz) => request.put('/clazzs', clazz);

//Deleting a class
export const deleteById = (id) => request.delete(`/clazzs/${id}`);