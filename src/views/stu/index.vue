<script setup>
import { onMounted, ref } from 'vue'
import { queryPageApi , addApi, queryInfoApi, updateApi, deleteApi, handleViolationApi} from '@/api/stu'
import { listClazzs } from '@/api/clazz'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateTime } from '@/utils/date';



// Degree options
const degrees = ref([{ name: 'Middle School', value: 1 },{ name: 'High School', value: 2 },{ name: 'Associate', value: 3 },{ name: 'Undergraduate', value: 4 },{ name: 'Master', value: 5 },{ name: 'Phd', value: 6 }])
//Gender options
const genders = ref([{ name: 'Male', value: 1 }, { name: 'Female', value: 2 }])
//Enrollment options
const whethers = ref([{ name: 'Yes', value: 1 }, { name: 'No', value: 0 }])
//Search object ref
let searchStu = ref({clazzId: '',degree: '',name: ''}) 
let tableData = ref([])

//Hook 
onMounted(() => {
  queryPage()
  queryAllClazz()
})


//All classes 
let clazzs = ref([])
//Load classes
const queryAllClazz = async () => {
  let result = await listClazzs()
  if(result.code) {
    clazzs.value = result.data
  }
}

let selectIds = ref([])
const handleSelectionChange = (selection) => {
  selectIds.value = selection.map(item => item.id)
}

//Pagination
const pagination = ref({currentPage: 1, pageSize: 10, total: 0})
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  queryPage()
}
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

//Pagination condition
const queryPage = async () => {
  const result = await queryPageApi(
      searchStu.value.clazzId,
      searchStu.value.degree,
      searchStu.value.name,
      pagination.value.currentPage,
      pagination.value.pageSize
  );

  if(result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  }
}

const clear = () => {
  searchStu.value = {clazzId:'', degree:'', name:'',}
  queryPage()
}

//----------- Add / Edit ---------------------------
let dialogFormVisible = ref(false) 
let labelWidth = ref(100) //label width on form
let formTitle = ref('')
let stu = ref({ //student form ref
  name: '',
  no: '',
  gender: '',
  phone: '',
  idCard: '',
  isCollege: '',
  address: '',
  degree: '',
  graduationDate: '',
  clazzId: ''
})

const clearStu = () => {
  stu.value = {
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: ''
  }
}

//Add Student
const addStu = () => {
  dialogFormVisible.value = true
  formTitle.value = 'Adding Student'
  clearStu()
}

const updateStu = async (id) => {
  clearStu()
  dialogFormVisible.value = true
  formTitle.value = 'Update Student Info'
  let result = await queryInfoApi(id)
  if(result.code){
    stu.value = result.data
  }
}

//form validation rules
const stuFormRef = ref()
const rules = ref({
  name: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be between 2 and 20', trigger: 'blur' }
  ],
  no: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
    { min: 10, max: 10, message: 'Must be a 10-digit number', trigger: 'blur' }
  ],
  gender: [{ required: true, message: 'Must select gender', trigger: 'change' }],
  phone: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
  ],
  isCollege: [
    { required: true, message: 'Must select enrollment status', trigger: 'change' }
  ],
  clazzId: [
    { required: true, message: 'Must select a class', trigger: 'change' }
  ],
})

const resetForm = (stuForm) => {
  if (!stuForm) return
  stuForm.resetFields()
}

//-------------Save Student Info
const save = (stuForm) => {
  //Form validation
  if(!stuForm) return
  stuForm.validate(async (valid) => {
    if(valid) {
      let api 
      if(stu.value.id) {
        api = updateApi(stu.value)
      }else {
        api = addApi(stu.value)
      }
      
      let result = await api
      if(result.code) {
        ElMessage.success('Opearation successful')
        dialogFormVisible.value = false
        queryPage()
      }else {
        ElMessage.error(result.msg)
      }
    }else {
      return false
    }
  })
}


//------- Delete Student
const delById = async (id) => {
  ElMessageBox.confirm('This will permanently delete this student. Continue?' , 'Warning', {confirmButtonText:'OK', cancelButtonText:'Cancel', type:'warning'})
    .then(async () => {
      let result =  await deleteApi(`${id}`)
      if(result.code) {
        ElMessage.success('Student deleted successfully')
        queryPage()
      }else {
        ElMessage.error(result.msg)
      }
    }).catch(() => {
      ElMessage.info('Deletion cancelled')
    })
}

//batch delete students
const delByIds = async () => {
  ElMessageBox.confirm('This will permanently delete these students. Continue?' , 'Deleting Students', {confirmButtonText:'Confirm', cancelButtonText:'Cancel',type:'warning'})
    .then(async () => {
      let result =  await deleteApi(selectIds.value.join(','))
      if(result.code) {
        ElMessage.success('Students deleted successfully')
        queryPage()
      }else {
        ElMessage.error(result.msg)
      }
    }).catch(() => {
      ElMessage.info('Deletion cancelled')
    })
}


const openViolation = (id) => {
  ElMessageBox.prompt('Enter the amount of points to deduct', 'Violation', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern: /\d?/,
    inputErrorMessage: 'Invalid Input',
  }).then(async (val) => {    
    let result = await handleViolationApi(id, val.value);
    if(result.code) {
      ElMessage.success('Opeartion successful')
      queryPage()
    }else {
      ElMessage.error(result.msg)
    }
  })
}
</script>

<template>
    <!-- Title -->
    <div>
      <div id="title">Student Management</div><br>
    </div>

    <!-- Search Bar -->
    <el-form :inline="true" :model="searchStu" class="demo-form-inline">
      <el-form-item label="Name">
        <el-input v-model="searchStu.name" placeholder="Enter Student Name"/>
      </el-form-item>

      <el-form-item label="Degree">
        <el-select v-model="searchStu.degree" placeholder="Select">
          <el-option v-for="degree in degrees" :label="degree.name" :value="degree.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="Class">
        <el-select v-model="searchStu.clazzId" placeholder="Select">
          <el-option v-for="clazz in clazzs" :label="clazz.name" :value="clazz.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryPage()">Query</el-button>
        <el-button type="info" @click="clear()">Clear</el-button>
      </el-form-item>
    </el-form>
    
    <!-- Buttons -->
    <el-button type="success" @click="addStu();resetForm(stuFormRef)">+ Add Student</el-button>
    <el-button type="danger" @click="delByIds()">- Delete Students</el-button>
    <br><br>
    
    
    <!-- Table -->
    <el-table :data="tableData" border style="width: 100%" fit @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center" width="35" />
      <el-table-column prop="name" label="Name" align="center" width="150px" />
      <el-table-column prop="no" label="Student Id" align="center" width="130px" />
      <el-table-column prop="clazzName" label="Class" align="center" width="160px"/>
      <el-table-column prop="gender" label="Gender" align="center" width="70px" >
        <template #default="scope">
          {{ scope.row.gender == 1 ? 'Male': 'Female' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="Phone" align="center" width="130px"/>
      <el-table-column prop="degree" label="Degree" align="center" width="110px">
        <template #default="scope">
          <span v-if="scope.row.degree == 1">Middle School</span>
          <span v-else-if="scope.row.degree == 2">High School</span>
          <span v-else-if="scope.row.degree == 3">Associate</span>
          <span v-else-if="scope.row.degree == 4">Undergraduate</span>
          <span v-else-if="scope.row.degree == 5">Master</span>
          <span v-else-if="scope.row.degree == 6">Phd</span>
          <span v-else>Other</span>
        </template>
      </el-table-column>
      <el-table-column prop="violationCount" label="Violation Count" align="center" width="85px" />
      <el-table-column prop="violationScore" label="Score Deducted" align="center" width="72px" />
      <el-table-column prop="updateTime" label="Last Updated" :formatter="formatDateTime" align="center" width="170px"/>
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="updateStu(scope.row.id) ;resetForm(stuFormRef)">Edit</el-button>
          <el-button type="warning" size="small" @click="openViolation(scope.row.id)">Violation</el-button>
          <el-button type="danger" size="small" @click="delById(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />



  
  <!-- Add/Edit Dialog -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="50%">
    <el-form :model="stu" ref="stuFormRef" :rules="rules">
      <!-- First Row -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="Name" :label-width="labelWidth" prop="name">
            <el-input v-model="stu.name" placeholder="Enter Student Name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Student Id" :label-width="labelWidth" prop="no">
            <el-input v-model="stu.no" placeholder="Please enter Student Id"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- Second Row -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="Gender" :label-width="labelWidth"  prop="gender">
            <el-select v-model="stu.gender" placeholder="Please Select" style="width: 100%;">
              <el-option v-for="gender in genders" :label="gender.name" :value="gender.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone" :label-width="labelWidth"  prop="phone">
            <el-input v-model="stu.phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Third Row -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="Gov Id" :label-width="labelWidth"  prop="idCard">
            <el-input v-model="stu.idCard" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Enrolled" :label-width="labelWidth" prop="isCollege">
            <el-select v-model="stu.isCollege" placeholder="Select" style="width: 100%;">
              <el-option v-for="w in whethers" :label="w.name" :value="w.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Fourth Row -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="Address" :label-width="labelWidth">
            <el-input v-model="stu.address" placeholder="Please your address"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Degree" :label-width="labelWidth">
            <el-select v-model="stu.degree" placeholder="Select" style="width: 100%;">
              <el-option v-for="degree in degrees" :label="degree.name" :value="degree.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- Fifth Row -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="Graduation Date" :label-width="labelWidth">
            <el-date-picker v-model="stu.graduationDate" type="date"  value-format="YYYY-MM-DD" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Class" :label-width="labelWidth" prop="clazzId">
            <el-select v-model="stu.clazzId" placeholder="Select the class belonged" style="width: 100%;">
              <el-option v-for="clazz in clazzs" :label="clazz.name" :value="clazz.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false; resetForm(stuFormRef)">Cancel</el-button>
        <el-button type="primary" @click="save(stuFormRef)">Save</el-button>
      </span>
    </template>
  </el-dialog>

</template>


<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>