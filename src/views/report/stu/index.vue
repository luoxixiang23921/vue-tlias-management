<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryStudentCountDataApi, queryEmpGenderDataApi, queryStudentDegreeDataApi } from '@/api/report'

onMounted(() => {
  loadStudentCountChart() 
  loadDegreeChart()
})

const loadStudentCountChart = async () => {
  let result = await queryStudentCountDataApi();
  let clazzList = result.data.clazzList;
  let dataList = result.data.dataList;

  console.log(clazzList, dataList);

  initStudentCountChart(clazzList, dataList)
}

const loadDegreeChart = async () => {
  let result = await queryStudentDegreeDataApi();
  initDegreeChart(result.data)
}

function initStudentCountChart(clazzList, dataList) {
  var myChart = echarts.init(document.getElementById('container1'));
  myChart.setOption({
    title: {
      text: 'Class Size Distribution',
      subText: '',
      textStyle: {
        fontSize: 20
      },
      left: 'center'
    },
    grid:{
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel:true
    },
    tooltip: {},
    xAxis: {
      data: clazzList,
      axisLabel: {
        interval: 0, // Show All Labels
        overflow: 'break'
      }
    },
    yAxis: {},
    series: [
      {
        name: 'Student Count',
        type: 'bar',
        data: dataList,
        itemStyle:{
          color:new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: '#ffbf61'
            },
            {
              offset: 1,
              color: '#dd5f85'
            }
          ])
        }
      }
    ]
  });
}

function initDegreeChart(degreeDataList) {
  var myChart = echarts.init(document.getElementById('container2'));
  let option = {
    title: {
      text: 'Degree Distribution',
      subText: '',
      textStyle: {
        fontSize: 20
      },
      left: 'center'
    },
    grid:{
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel:true
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        name: 'Degree',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        top: '5%',
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: degreeDataList
      }
    ]
  };
  myChart.setOption(option);
}

</script>

<template>
  <div class="report_container" id="container1">
    
  </div>

  <div class="report_container" id="container2">
    
  </div>
</template>

<style scoped>
.report_container {
  width: 49%;
  height: 90%;
  float: left;
  margin-left: 5px;
}

#container1 {
  border-right: 1px dashed #ccc;
}
</style>