<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { listEmps } from '@/api/emp';
  import { queryPage, add as addClazz, findById, updateClazz, deleteById as deleteClazz} from '@/api/clazz'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { formatDateTime } from '@/utils/date';
  
  
  const subjects = ref([{ name: 'Natural Science', value: 1 },{ name: 'Humanities', value: 2 },{ name: 'Computer Science', value: 3 },{ name: 'History', value: 4 },{ name: 'Mathematics', value: 5 },{ name: 'Social Science', value: 6 }])

  const clazzList = ref([]);
  const empList = ref([]);
  // form validation
  const clazzFormRef = ref();
  
  const searchClazz = ref({
    name: '',
    begin: '',
    end: '',
    date: ''
  })

  const clazz = ref({
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    masterId: '',
    subject: ''
  })

  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  const search = async () => {
    const result = await queryPage(searchClazz.value.name, searchClazz.value.begin, 
                              searchClazz.value.end, currentPage.value, pageSize.value);
    if (result.code) {
      total.value = result.data.total;
      clazzList.value = result.data.rows;
    }
    else{
      ElMessage.error(result.message);
    }
  }

  const clear = () => {
    searchClazz.value = {
      name: '',
      begin: '',
      end: ''
    }
    search();
  }

  const loadAllEmps = async () => {
    const result = await listEmps();
    if (result.code) {
      empList.value = result.data;
    }
  }
    // Pagination methods
  const handleSizeChange = (newSize) => {
    search();
  }

  // when current page changes
  const handleCurrentChange = (newPage) => {
    search();
  }

  onMounted(() => {
    loadAllEmps();
    search();
  })

  const rules = ref({
  name: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
    { min: 3, max: 40, message: 'Length should be between 3 and 40', trigger: 'blur' },
  ],
  room: [
    { required: true, message: 'Cannot be empty', trigger: 'blur' },
    { min: 1, max: 20, message: 'Length should be between 1 and 20', trigger: 'blur' }
  ]
})


  // add clazz Dialogue
  const dialogVisible = ref(false);
  const dialogTitle = ref('');

  const openAddClazzDialogue = () => {
    dialogVisible.value = true;
    dialogTitle.value = 'Adding a Class'
    clazz.value = {
      name: '',
      room: '',
      beginDate: '',
      endDate: '',
      masterId: '',
      subject: ''
    }
    if (clazzFormRef.value) {
      clazzFormRef.value.resetFields();
    }
  }

  const save = async () => {
    if (!clazzFormRef.value) return;
    clazzFormRef.value.validate(async (valid) => {
      if (valid){ // if input is valid 
        let result;
        if (clazz.value.id) { // if id exists, update
          result = await updateClazz(clazz.value);
        } else { // if id does not exist, add
          result = await addClazz(clazz.value);
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
  const openEditDialogue = async (id) => {
    dialogVisible.value = true;
    dialogTitle.value = 'Editing Class';
    const result = await findById(id);
    if ( result.code ){
      clazz.value = result.data;
    }
  }

  const deleteById = async (id) => {
    ElMessageBox.confirm(
      'This will permanently delete this class. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    .then( async () => {
      const result = await deleteClazz(id);
      if (result.code) {
        ElMessage.success('Class deleted successfully');
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

</script>

<template>
  <h1>Class Management</h1>
  <!-- {{ searchClazz }} -->

  <!-- search bar -->
  <div class="container">
    <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
    <el-form-item label="Name">
      <el-input v-model="searchClazz.name" placeholder="Enter a class name" />
    </el-form-item>

    <el-form-item label="Start Date">
      <el-date-picker
        v-model="searchClazz.date"
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
    <el-button type="primary" @click="openAddClazzDialogue">Add Class</el-button>
  </div>

  <!-- table -->
  <div class="container">
    <el-table :data="clazzList" border style="width: 100%">
      <el-table-column type="index" align="center" width="100" />
      <el-table-column prop="name" label="Name" align="center"/>
      <el-table-column prop="room" label="Room #" align="center"/>
      <el-table-column prop="masterName" label="Teacher" align="center"/>
      <el-table-column prop="beginDate" label="Start Date" align="center"/>
      <el-table-column prop="endDate" label="End Date" align="center"  />
      <el-table-column prop="status" label="Status" align="center"/>
      <el-table-column prop="updateTime" label="Last Updated" :formatter="formatDateTime" align="center"/>
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
    {{ clazz }}
      <el-form :model="clazz" :rules="rules" ref="clazzFormRef" label-width="80px">
        <!-- Basic Info -->
        <!-- First Row -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Name" prop="name">
              <el-input v-model="clazz.name" placeholder="3 to 40 characters"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Room" prop="room">
              <el-input v-model="clazz.room" placeholder="1 to 20 characters"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Start Date" >
              <el-date-picker v-model="clazz.beginDate" type="date" style="width: 100%;" placeholder="Pick a Date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="End Date" >
              <el-date-picker v-model="clazz.endDate" type="date" style="width: 100%;" placeholder="Pick a Date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Teacher">
              <el-select v-model="clazz.masterId" placeholder="Please select a Teacher" style="width: 100%;">
                <el-option v-for="emp in empList" :key="emp.id" :label="emp.name" :value="emp.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Subject">
              <el-select v-model="clazz.subject" placeholder="Please select a subject" style="width: 100%;">
                <el-option v-for="subject in subjects" :key="subject.value" :label="subject.name" :value="subject.value"></el-option>
              </el-select>
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
  margin: 13px 0px;
}
</style>