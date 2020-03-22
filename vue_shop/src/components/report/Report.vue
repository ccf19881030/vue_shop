<template>
  <div>
    <h3>数据报表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
// 导入lodash
import _ from 'lodash'
export default {
  data() {
    return {
    // 需要跟请求的折线图数据合并的options
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      option: {
        backgroundColor: '#fffff',
        title: {
          text: ''
        },
        tooltip: {
          enabled: false
        },
        legend: {
          data: ''
        },
        xAxis: {
          lineWidth: 2,
          type: 'category',
          color: 'white',
          dashStyle: 'solid', // 标示线的样式，默认是solid（实线），这里定义为长虚线longdashdot
          tickPixelInterval: 1,
          categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          // lineWidth :0,//去掉x轴线
          tickWidth: 0, // 去掉刻度
          axisLabel: {
            show: false
          }, // 去掉刻度数字
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          lineColor: 'white'
        },
        yAxis: {
          gridLineWidth: 0, // 去掉y轴方向的横线
          type: 'value',
          lineWidth: 2,
          lineColor: 'white',
          max: 25,
          title: {
            text: ''
            // text: '气量'
          },
          tickWidth: 0, // 去掉刻度
          axisLabel: {
            show: false
          }, // 去掉刻度数字

          axisLine: {// y轴
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisTick: {// y轴刻度线
            show: false
          },
          splitLine: {// 网格线
            show: false
          }
        },
        series: [{
          name: '',
          type: 'line',
          // symbol: 'none',
          // smooth: true,
          symbol: 'circle', // 设定为实心点
          symbolSize: 10, // 设定实心点的大小
          itemStyle: {
            normal: {
              color: '#fff'
            }
          },
          data: [0, 2, 3, 2, 1, 0, 4, 5, 7, 8, 9, 4, 2, 1, 0, 0]
        }]
      }
    }
  },
  created() {
  },
  async mounted() {
    // 在页面dom元素加载完毕之后执行的钩子函数mounted
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 准备数据和配置项
    // 发送请求获取折线图数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    console.log(res)
    // 合并res.data和this.options
    const result = _.merge(res.data, this.options)
    // console.log(result)
    // 使用获取的数据展示图表
    myChart.setOption(result)
    // myChart.setOption(this.option)
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
</style>
