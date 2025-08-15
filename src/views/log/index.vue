<script setup>
import { onMounted, ref } from 'vue'
import { queryPageApi} from '@/api/log'


let tableData = ref([])

onMounted(() => {
  queryPage()
})

const pagination = ref({currentPage: 1, pageSize: 15, total: 0})
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  queryPage()
}
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

const queryPage = async () => {
  const result = await queryPageApi(pagination.value.currentPage,pagination.value.pageSize);

  if(result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  }
}
</script>

<template>

    <div>
      <div id="title">Opearation Log</div>
      <br>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" fit size="small">
      <el-table-column prop="operateEmpName" label="Operator" align="center" width="80px"/>
      <el-table-column prop="operateTime" label="Operate Time" align="center" width="150px"/>
      <el-table-column prop="className" label="Class Name" align="center" width="300px" />
      <el-table-column prop="methodName" label="Method Name" align="center" width="100px" />
      <el-table-column prop="costTime"  label="Time Taken (ms)" align="center" width="120px"/>
      <el-table-column prop="methodParams" label="Query Param" align="center" width="280px">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" popper-style="font-size:12px">
            <template #default>
              <div>Param: {{ scope.row.methodParams }}</div>
            </template>
            <template #reference>
              <el-tag v-if="scope.row.methodParams.length <= 30">{{ scope.row.methodParams}}</el-tag>
              <el-tag v-else>{{ scope.row.methodParams.substring(0,30) + '...' }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="returnValue"  label="Return Value" align="center"></el-table-column>
    </el-table>
    <br>
    
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>


<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>