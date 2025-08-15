import request from '@/utils/request'

// Count the number of employees in each position
export const queryEmpJobDataApi = () => request.get(`/report/empJobData`)

// Count employee gender information
export const queryEmpGenderDataApi = () => request.get(`/report/empGenderData`)

// Count the number of students in each class
export const queryStudentCountDataApi = () => request.get(`/report/studentCountData`)

// Count student education level information
export const queryStudentDegreeDataApi = () => request.get(`/report/studentDegreeData`)

