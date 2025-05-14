	<template>
	  <view class="charts-page-container">
		<!-- 柱状图区域 -->
		<view class="chart-section">
		  <text class="chart-title">成都市下辖区GDP (2024年)</text>
		  <uni-echarts
			ref="districtChart"
			:option="districtChartOptions"
			canvasId="districtGDPChart"
			custom-class="chart" />
		</view>

		<!-- 折线图区域 -->
		<view class="chart-section">
		   <text class="chart-title">成都市历年GDP走势 (1990-2024)</text>

		   <uni-echarts
			ref="cityChart"
			:option="cityChartOptions"
			canvasId="cityGDPChart"
			custom-class="chart" />
		</view>

		<!-- 可以根据需要添加更多图表或说明文字 -->

	  </view>
	</template>

	<script>
	// **1. 导入 ECharts 核心和需要的模块**
	// 这些导入是 ECharts 按需引入的要求，与适配组件无关，但需要导入以便注册使用
	import * as echarts from 'echarts/core'; // 导入 ECharts 核心
	import { BarChart, LineChart } from 'echarts/charts'; // 导入柱状图和折线图
	import {
	  GridComponent,       // 导入网格组件 (用于直角坐标系)
	  TitleComponent,      // 导入标题组件
	  TooltipComponent,    // 导入提示框组件
	  LegendComponent      // 导入图例组件 (如果需要显示图例)
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers'; // 导入 Canvas 渲染器

	// **2. 导入您安装的 uni-echarts 适配组件**
	// **!!! 这是关键步骤，请根据您项目中 uni_modules/xiaohe-echarts 的实际路径进行调整 !!!**
	import uniEcharts from '@/uni_modules/xiaohe-echarts/components/uni-echarts/uni-echarts.vue'; // 示例路径，请核实

	// **3. 注册 ECharts 模块**
	// 这一步是 ECharts 按需引入的固定用法，确保导入的图表和组件功能可用
	echarts.use([
	  BarChart,
	  LineChart,
	  GridComponent,
	  TitleComponent,
	  TooltipComponent,
	  LegendComponent, // 如果使用了图例，需要注册
	  CanvasRenderer
	]);

	// 如果您的适配组件需要手动导入特定的 init 方法或 provide 方法，请根据文档导入
	// 例如: import { provideEchartsTheme } from "@/uni_modules/xiaohe-echarts"; // 如果需要主题

	export default {
	   // **4. 局部注册 uni-echarts 组件**
	   // 这是解决 "Failed to resolve component" 警告的最直接方式
	   components: {
		 uniEcharts // 将导入的组件注册到当前页面
	   },
	   data() {
		return {
		  districtChartOptions: null, // 柱状图 ECharts option 对象
		  cityChartOptions: null      // 折线图 ECharts option 对象
		};
	   },
	   onReady() { // 或者 mounted 生命周期钩子，确保组件已准备好
		// 在页面加载完成后初始化 ECharts 配置数据
		this.initDistrictChartOptions();
		this.initCityChartOptions();

		// **重要：** 根据您使用的 uni-echarts 适配组件的文档，
		// 可能需要在数据初始化后手动调用组件的方法来渲染或刷新图表。
		// 有些组件会自动监听 option 变化，有些则需要手动调用类似 init() 或 setOption(option) 的方法。
		// 请查阅您使用的组件的文档来确定是否需要以下代码。
		// 假设您的组件提供了 init() 方法，并且您在模板中设置了 ref：
		// if (this.$refs.districtChart) {
		//     this.$refs.districtChart.init(echarts); // 某些组件需要传入 echarts 实例
		// }
		 // if (this.$refs.cityChart) {
		//     this.$refs.cityChart.init(echarts); // 某些组件需要传入 echarts 实例
		// }

		// 或者如果组件是通过 setOption 更新的：
		// if (this.$refs.districtChart && this.districtChartOptions) {
		//     this.$refs.districtChart.setOption(this.districtChartOptions);
		// }
		// if (this.$refs.cityChart && this.cityChartOptions) {
		//     this.$refs.cityChart.setOption(this.cityChartOptions);
		// }
	   },
	  methods: {
		// 组织柱状图 ECharts Options
		initDistrictChartOptions() {
		  this.districtChartOptions = {
			title: {
			  text: '成都市下辖区GDP走势图',
			  left: 'center'
			},
			tooltip: {
			  trigger: 'axis',
			  axisPointer: { type: 'shadow' }
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
			  type: 'category',
			  data: [
				'金牛区', '青羊区', '龙泉驿区', '锦江区', '成华区','武侯区', '双流区', '新都区',
				'郫都区', '温江区', '青白江区', '彭州市', '金堂县', '都江堰市', '新津区',
				'崇州市', '邛崃市', '大邑县', '蒲江县', 
			  ],
			   axisLabel: {
				 interval: 1,
				 rotate: 40
			   }
			},
			yAxis: {
			  type: 'value',
			  name: '成都市下辖地区生产总值（单位：亿元）',
			  axisLabel: { formatter: '{value}' }
			},
			series: [{
			  name: '2024年GDP',
			  type: 'bar',
			  barWidth: '40%',
			  data: [
				  1702.3, 1675.6, 1585.8, 1545.05, 1505,1457, 1241, 1129.9, 822, 770.8,
				  717.6, 714.6, 706.3, 545.44, 534.9, 518.4, 453.76, 373.4, 228.6,  // 武侯区数据请务必核实
			  ],
			   itemStyle: { color: '#269ffb' }
			}]
		  };
		},

		// 组织折线图 ECharts Options
		initCityChartOptions() {
		   const categories = [
				'1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998',
				'1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007',
				'2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016',
				'2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'
			];
			const data = [
				174.26, 204.47, 354.79, 416.87, 558.3533, 713.6718, 869.3356, 1007.026, 1102.5948,
				1190.0325, 1312.99, 1492.037, 1667.1012, 1870.8046, 2185.7299, 2370.7644, 2750.4776,
				3324.1677, 3900.9857, 4502.6032, 5551.33, 6854.58, 8138.94, 9108.89, 10056.59,
				10801.16, 12170.23, 13889.39, 15342.77, 17013, 17717, 19916.98, 20817.5, 22074.7, 23511.3
			];

		   this.cityChartOptions = {
			 title: {
				text: '成都市历年GDP走势图',
				 left: 'center'
			 },
			 tooltip: {
			   trigger: 'axis'
			 },
			 grid: {
				 left: '3%',
				 right: '4%',
				 bottom: '3%',
				 containLabel: true
			 },
			 xAxis: {
			   type: 'category',
			   boundaryGap: false,
			   data: categories,
				axisLabel: {
				  interval: 5,
				  rotate: 40
				}
			 },
			 yAxis: {
			   type: 'value',
			   name: '成都市地区生产总值（单位：亿元）',
			   axisLabel: {
				 formatter: '{value}'
			   }
			 },
			 series: [{
			   name: '成都市GDP',
			   type: 'line',
			   data: data,
			   smooth: true,
			   lineStyle: { color: '#269ffb' },
			   itemStyle: { color: '#269ffb' },
			   showSymbol: true,
			   symbol: 'circle',
			   symbolSize: 3,
			   emphasis: { itemStyle: { symbolSize: 8 } }
			   // areaStyle: { color: 'rgba(38,159,251, 0.4)' } // 如果需要填充区域
			 }]
		   };
		}
		// 请根据您使用的 uni-echarts 组件的文档，确定是否需要手动调用 setOption 或 init 方法来渲染图表
	  }
	};
	</script>

	<style scoped>
	/* 页面容器样式 */
	.charts-page-container {
	  padding: 15px;
	  background-color: #f5f5f5; /* 与首页背景色一致 */
	  min-height: 100vh; /* 最小高度 */
	}

	/* 每个图表区域的样式，模仿首页的 section-block */
	.chart-section {
	  background-color: #fff;
	  margin-bottom: 15px; /* 与下一个图表区的间距 */
	  padding: 15px;
	  border-radius: 12px;
	  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	/* 图表标题样式 */
	.chart-title {
	  font-size: 16px;
	  font-weight: bold;
	  color: #333;
	  margin-bottom: 10px;
	  display: block; /* 让标题独占一行 */
	  text-align: center; /* 标题居中 */
	}

	/* **设置 uni-echarts 组件的高度** */
	/* 使用您在模板中设置的 custom-class="chart" */
	.chart {
		width: 100%;
		height: 300px; /* **图表必须有高度才能渲染** */
		display: block;
	}

	/* 如果需要，可以给 canvas 元素设置高度（如果适配组件内部有 canvas） */
	/* .charts-page-container >>> canvas {
		width: 100% !important;
		height: 300px !important; // 示例高度
	} */
	</style>