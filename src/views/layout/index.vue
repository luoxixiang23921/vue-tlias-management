<script setup>
  import { onMounted, ref }  from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const loginName = ref('');
  const router = useRouter();

  const setLoginName = () => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    if (loginUser && loginUser.username) {
      loginName.value = loginUser.username;
    }
  }

  const logout = () => {
    ElMessageBox.confirm(
      'This will log you out. Continue?', 'Warning',
      {
        confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning',
      }
    )
    .then( async () => {
      localStorage.removeItem('loginUser');
      ElMessage.success('Logged out successfully');
      router.push('/login');
    })
    .catch(() => {
      ElMessage.info('Log out cancelled');
    })
  }

  onMounted(() => {
    setLoginName();
  })

</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias Management System</span>
        <span class="right_tool">
          <a href="">
            <el-icon><EditPen /></el-icon> Change Password &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="" @click.prevent="logout">
            <el-icon><SwitchButton /></el-icon> Log Out [ {{ loginName  }} ]
          </a>
        </span>
      </el-header>
      
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <!-- 左侧菜单栏 -->
          <el-menu router>
            <!-- 首页菜单 -->
            
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon> Homepage
            </el-menu-item>
            
            <!-- 班级管理菜单 -->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><Menu /></el-icon> Class Management
              </template>
              <el-menu-item index="/clazzs">
                <el-icon><HomeFilled /></el-icon> Classes
              </el-menu-item>
              <el-menu-item index="/students">
                <el-icon><UserFilled /></el-icon> Students
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon> System Information
              </template>
              <el-menu-item index="/depts">
                <el-icon><HelpFilled /></el-icon> Department Management
              </el-menu-item>
              <el-menu-item index="/emps">
                <el-icon><Avatar /></el-icon> Employee Management
              </el-menu-item>
            </el-sub-menu>

            <!-- 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon><Histogram /></el-icon> Statistics
              </template>
              <el-menu-item index="/empReport">
                <el-icon><InfoFilled /></el-icon> Employee Data
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon><Share /></el-icon> Student Data
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><Document /></el-icon> Logs Info
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  /* font-family: 楷体; */
  font-family: 'Courier New', Courier, monospace;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
