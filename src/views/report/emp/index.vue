<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryEmpJobDataApi, queryEmpGenderDataApi } from '@/api/report'

onMounted(() => {
  loadJobChart()
  loadGenderChart()
})

//Load Job Stats
const loadJobChart = async () => {
  let result = await queryEmpJobDataApi();
  let jobList = result.data.jobList;
  let dataList = result.data.dataList;

  initJobChart(jobList, dataList)
}

//Load Gender Stats
const loadGenderChart = async () => {
  let result = await queryEmpGenderDataApi();
  initGenderChart(result.data)
}


function initJobChart(jobList, dataList) {
  // Init echarts instance based on prepared DOM
  var myChart = echarts.init(document.getElementById('container1'));
  // Draw the chart
  myChart.setOption({
    title: {
      text: 'Employee Position Distribution',
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
      data: jobList,
      axisLabel: {
        interval: 0, // Show All Labels
        overflow: 'break'
      }
    },
    yAxis: {},
    series: [
      {
        name: 'Count',
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

function initGenderChart(genderDataList) {
  var myChart = echarts.init(document.getElementById('container2'));
  let option = {
    title: {
      text: 'Employee Gender Distribution',
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
        name: 'Gender',
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
        data: genderDataList
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