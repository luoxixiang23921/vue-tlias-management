<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { queryPage } from '@/api/emp';
  import { findAll as findAllDepts } from '@/api/dept';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { addEmp, findById, updateEmp, deletebyIds} from '@/api/emp';

  
  //Job Title List
  const jobs = ref([{ name: 'Teacher', value: 1 },{ name: 'Administrator', value: 2 },{ name: 'Counselor', value: 3 },{ name: 'Librarian', value: 4 },{ name: 'Department Chair', value: 5 },{ name: 'Other', value: 6 }])
  //Gender List
  const genders = ref([{ name: 'Male', value: 1 }, { name: 'Female', value: 2 }])
  const depts = ref([]);
  const selectedEmpIds = ref([]);
  const token = ref({});


  const searchEmp = ref({
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: ''
  });

  const empList = ref([]);
  const empFormRef = ref();

  const currentPage = ref(1);
  const pageSize = ref(10);
  const background = ref(true);
  const total = ref(0);

  const search = async () => {
    const result = await queryPage(searchEmp.value.name, searchEmp.value.gender, searchEmp.value.begin, 
                                  searchEmp.value.end, currentPage.value, pageSize.value)
    if (result.code) {
      empList.value = result.data.rows;
      total.value = result.data.total;
    }
    else{
      ElMessage.error(result.message);
    }
  }

  const clear = () => {
    searchEmp.value = {
      name: '',
      gender: '',
      date: [],
      begin: '',
      end: ''
    }
    search();
  }

  watch(() => searchEmp.value.date, (newVal, oldVal) => {
    if (newVal.length === 2) {
      searchEmp.value.begin = newVal[0];
      searchEmp.value.end = newVal[1];
    }
    else{
      searchEmp.value.begin = '';
      searchEmp.value.end = '';
    }
  });

  // Pagination methods
  const handleSizeChange = (newSize) => {
    search();
  }

  // when current page changes
  const handleCurrentChange = (newPage) => {
    search();
  }

  onMounted(() => {
    // get token for upload 
    getToken();
    search();
    queryAllDepts();
  })

  const getToken = () => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    if (loginUser && loginUser) {
      token.value = loginUser.token;
    }
  }

  const queryAllDepts = async () => {
    const result = await findAllDepts();
    if (result.code) {
      depts.value = result.data;
    }
  }

  //add/edit form
  const employee = ref({
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  })

    watch(() => employee.value.exprList, (newVal, oldVal) => {
      if (employee.value.exprList && employee.value.exprList.length > 0){
        employee.value.exprList.forEach(expr => {
          expr.begin = expr.date[0];
          expr.end = expr.date[1];
        });
      }
    }, {deep: true});


  // Dialog control
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增员工')

  const openAddEmpDialogue = () => {
    dialogVisible.value = true;
    dialogTitle.value = 'Adding Employee';
    employee.value = {
      username: '',
      name: '',
      gender: '',
      phone: '',
      job: '',
      salary: '',
      deptId: '',
      entryDate: '',
      image: '',
      exprList: []
    };
    if (empFormRef.value) {
      empFormRef.value.resetFields();
    }
  }

  const openEditDialogue = async (id) => {
    dialogTitle.value = 'Editing Employee Information';
    dialogVisible.value = true;
    const result = await findById(id);
    if (result.code){
      employee.value = result.data;

      employee.value.exprList.forEach(expr => {
        expr.date = [expr.begin, expr.end];
      });
    }
    
  }

  const save = async () => {
    if (!empFormRef.value) return;
    empFormRef.value.validate(async (valid) => {
      if (valid){ // if input is valid 
        let result;
        if (employee.value.id) { // if id exists, update
          result = await updateEmp(employee.value);
        } else { // if id does not exist, add
          result = await addEmp(employee.value);
        }
        if (result.code == 1){ // if operation is successful
          ElMessage.success('Operation successful');
          dialogVisible.value = false;
          search();
        }
        else {
          ElMessage.error(result.msg);
        }
      }
      else{
        ElMessage.error('Invalid Input');
      }
    })
  }

  const deleteById = (id) => {
    console.log('deleteById', id);
    ElMessageBox.confirm(
      'This will permanently delete this Employee. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    .then( async () => {
      const result = await deletebyIds(id);
      if (result.code) {
        ElMessage.success('Employee deleted successfully');
        search();
      }
      else{
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      ElMessage.info('Deletion cancelled');
    })
  }

  const deleteBySelectedIds = () => {
    console.log('deleteBySelectedIds', selectedEmpIds.value);
    ElMessageBox.confirm(
      'This will permanently delete these employees. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    .then( async () => {
      if (selectedEmpIds.value && selectedEmpIds.value.length > 0){
        const ids = selectedEmpIds.value.join(',');
        const result = await deletebyIds(ids);
        if (result.code) {
          ElMessage.success('Employees deleted successfully');
          search();
        }
        else{
          ElMessage.error(result.msg);
        }
      } 
      else {
        ElMessage.info('You have not selected any employees to delete');
      }
    })
    .catch(() => {
      ElMessage.info('Deletion cancelled');
    })
  }

  //File Upload
  const handleAvatarSuccess = (response) => {
    employee.value.image = response.data;
    // console.log(response);
  }
  const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
      ElMessage.error('Only supports uploading jpg or png images')
      return false
    } else if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('Image size cannot exceed 10M')
      return false
    }
    return true
  }

  // Add Employee's work experience
  const addExprItem = () => {
    employee.value.exprList.push({
      company: '',
      job: '',
      begin: '',
      end: '',
      date: []
    });
  }

  const deleteExprItem = (index) => {
    employee.value.exprList.splice(index, 1)
  }

  // selection logic 
  const handleSelectionChange = (selections) => {
    selectedEmpIds.value = selections.map(item => item.id);
  }

    // form rules
  const rules = ref({
    name: [
      { required: true, message: 'Cannot be empty', trigger: 'blur' },
      { min: 2, max: 20, message: 'Length should be between 2 and 20', trigger: 'blur' },
    ],
    username: [
      { required: true, message: 'Cannot be empty', trigger: 'blur' },
      { min: 2, max: 20, message: 'Length should be between 2 and 20', trigger: 'blur' },
    ],
    gender: [
      { required: true, message: 'Cannot be empty', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: 'Cannot be empty', trigger: 'blur' },
      { pattern: /^\d{10}$/, message: 'Invalid phone number format', trigger: 'blur' }
    ]
  })



  // Date shortcuts
  const shortcuts = [
    {
      text: 'Last week',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: 'Last month',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: 'Last 3 months',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
  ]
</script>

<template>
  <h1>Employee Dashboard</h1>
  <!-- search bar -->
  <div class="container">
      <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="Name">
        <el-input v-model="searchEmp.name" placeholder="Enter Employee's Name" />
      </el-form-item>
      <el-form-item label="Gender">
        <el-select
          v-model="searchEmp.gender"
          placeholder="Select Gender"
        >
          <el-option label="Male" value="1" />
          <el-option label="Female" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Start Date">
        <!-- <el-date-picker
          v-model="searchEmp.date"
          type="date"
          placeholder="Pick a date"
        /> -->
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="YYYY-MM-DD"
          :shortcuts="shortcuts"
        />
        
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">Query</el-button>
        <el-button type="info" @click="clear">Clear</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- buttons -->
  <div class="container"> 
    <el-button type="primary" @click="openAddEmpDialogue">Add Employee</el-button>
    <el-button type="danger" @click="deleteBySelectedIds">Delete Selected</el-button>
  </div>

  <!-- table -->
  <div class="container">
    <el-table :data="empList" @selection-change="handleSelectionChange" border style="width: 100%">
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column prop="username" label="Username" align="center" /> -->
      <el-table-column prop="name" label="Name" align="center"/>
      <el-table-column label="Gender" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? 'Male' : 'Female' }}
        </template>
      </el-table-column>
      <el-table-column label="Avatar" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40px"/>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="Department" align="center"  />
      <el-table-column label="Job" align="center"> 
        <template #default="scope">
          <span v-if="scope.row.job === 1">Teacher</span>
          <span v-else-if="scope.row.job === 2">Administrator</span>
          <span v-else-if="scope.row.job === 3">Counselor</span>
          <span v-else-if="scope.row.job === 4">Librarian </span>
          <span v-else-if="scope.row.job === 5">Department Chair</span>
          <span v-else>Other</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="Entry Date" align="center"/>
      <el-table-column prop="updateTime" label="Last Updated" align="center"/>
      <el-table-column label="Opeartion" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialogue(scope.row.id)"><el-icon><EditPen /></el-icon>  Edit</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)"><el-icon><Delete /></el-icon>  Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- pagination -->
   <div class="container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
   </div>

   <!-- add/edit employee dialog -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <!-- {{ employee }} -->
      <el-form :model="employee" :rules="rules" ref="empFormRef" label-width="80px">
        <!-- Basic Info -->
        <!-- First Row -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Username" prop="username">
              <el-input v-model="employee.username" placeholder="2 to 20 characters"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="employee.name" placeholder="2 to 10 characters"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Gender" prop="gender">
              <el-select v-model="employee.gender" placeholder="Please Select Gender" style="width: 100%;">
                <el-option v-for="g in genders" :key="g.value" :label="g.name" :value="g.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="employee.phone" placeholder="Please Enter Phone Number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Job Title">
              <el-select v-model="employee.job" placeholder="Please select a job title" style="width: 100%;">
                <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value"></el-option>
                
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Salary">
              <el-input v-model="employee.salary" placeholder="Please Enter Salary"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Department">
              <el-select v-model="employee.deptId" placeholder="Select a Department" style="width: 100%;">
                <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Entry Date">
              <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="Pick a Date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Avatar">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :headers="{'token': token }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <img v-if="employee.image" :src="employee.image" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        

        <!-- Work Experience Button-->
        <!-- Sixth Row -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="Work">
              <el-button type="success" size="small" @click="addExprItem">+ Add Work Experience</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- Seventh Row ...  Work Experience -->
        <el-row :gutter="3" v-for="expr in employee.exprList">
          <el-col :span="10">
            <el-form-item size="small" label="Date" label-width="80px">
              <el-date-picker v-model="expr.date" type="daterange"  range-separator="To" start-placeholder="Start Date" end-placeholder="End Date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
            </el-form-item>
          </el-col>

          <!-- v-model="employee.exprList.company" -->
          <el-col :span="6">
            <el-form-item size="small" label="Company" label-width="60px">
              <el-input v-model="expr.company" placeholder="Enter Company's Name"></el-input>
            </el-form-item>
          </el-col>

          <!-- v-model="employee.exprList.job" -->
          <el-col :span="6">
            <el-form-item size="small" label="Position" label-width="60px">
              <el-input  v-model="expr.job" placeholder="Enter Position"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item size="small" label-width="0px">
              <el-button type="danger" @click="deleteExprItem">- Delete</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="save">Save</el-button>
        </span>
      </template>
  </el-dialog>

</template>

<style scoped>
  .container {
    margin: 10px 0px;
  }

  .avatar {
    height: 40px;
  }
  .avatar-uploader .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    text-align: center;
    border-radius: 10px;
    /* 添加灰色的虚线边框 */
    border: 1px dashed var(--el-border-color);
  }

</style>