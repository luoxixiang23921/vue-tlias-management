import request from '@/utils/request'

//Pagination
export const queryPageApi = (clazzId, degree, name, page, pageSize) => 
  request.get(`/students?clazzId=${clazzId}&degree=${degree}&name=${name}&page=${page}&pageSize=${pageSize}`)

//Add
export const addApi = (stu) => request.post('/students', stu)

//Search by Id
export const queryInfoApi = (id) => request.get(`/students/${id}`)

//Edit student information
export const updateApi = (stu) => request.put(`/students`, stu)

//Delete students by IDs
export const deleteApi = (ids) => request.delete(`/students/${ids}`)

//Violation handling
export const handleViolationApi = (id, score) => request.put(`/students/violation/${id}/${score}`) 

