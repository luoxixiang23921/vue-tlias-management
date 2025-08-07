<script setup>
  import { Delete, EditPen } from '@element-plus/icons-vue';
  import { onMounted, ref } from 'vue';  
  import { add, findAll, findById, update, deleteById} from '@/api/dept';
  import { ElMessage, ElMessageBox} from 'element-plus';

  const deptList = ref([]);
  const dept = ref({name: ''});
  const formTitle = ref('');
  const deptFormRef = ref();
  const dialogFormVisible = ref(false);

  const search = async () => {
    const result = await findAll();
    if (result.code) {
      deptList.value = result.data;
    }
  }
  
  const save = async () => {
    if (!deptFormRef.value) return;
    deptFormRef.value.validate(async (valid) => {
      if (valid){ // if input is valid 
        let result;
        if (dept.value.id) { // if id exists, update
          result = await update(dept.value);
        } else { // if id does not exist, add
          result = await add(dept.value);
        }
        if (result.code == 1){ // if operation is successful
          ElMessage.success('Operation successful');
          dialogFormVisible.value = false;
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

  const edit = async (id) => {
    formTitle.value = 'Editing Department';
    dialogFormVisible.value = true;
    dept.value = {name: ''}; // Reset the form
    if (deptFormRef.value) {
      deptFormRef.value.resetFields();
    }

    const result = await findById(id);
    
    if (result.code) {
      dept.value = result.data;
    }
  }

  const addDept = () => {
    dialogFormVisible.value = true;
    formTitle.value = 'Adding Department';
    dept.value = {name: ''}; // Reset the form
    if (deptFormRef.value){
      deptFormRef.value.resetFields();
    }
  }

  const deleteDept = (id) => {
    console.log('deleteById', id);
    ElMessageBox.confirm(
      'This will permanently delete this department. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    .then( async () => {
      console.log('deleteById', id);
      const result = await deleteById(id);
      if (result.code) {
        ElMessage.success('Department deleted successfully');
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

  onMounted(() => {
    search();
  })


  // form rules
  const rules = ref({
    name: [
      { required: true, message: 'Cannot be empty', trigger: 'blur' },
      { min: 2, max: 10, message: 'Length should be between 2 and 10', trigger: 'blur' },
    ]
  })


</script>

<template>
  <h1>Department Management</h1>
  <div class="container">
    <el-button type="primary" @click="addDept">+ Add Department</el-button>
  </div>

  <!-- table -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" align="center" width="100" />
      <el-table-column prop="name" label="Department Name" align="center" width="260" />
      <el-table-column prop="updateTime" label="Last Updated Time" align="center" width="300"/>
      <el-table-column label="Opeartion" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon><EditPen /></el-icon>  Edit</el-button>
          <el-button type="danger" size="small" @click="deleteDept(scope.row.id)"><el-icon><Delete /></el-icon>  Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <!-- add department dialog -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="Name" label-width="80px" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 20px 0px;
}
</style>
