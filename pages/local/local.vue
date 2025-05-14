<template>
  <!-- 移除最外层容器上的 blurred class 绑定 -->
  <view class="history-map-container">
    <!-- 给地图 section 动态绑定 class -->
    <view class="map-chart-section" :class="{'blurred': isPopupOpen}">
      <!-- 图表标题 -->
      <text class="chart-title">成都市行政区划图</text>

      <!-- ECharts 地图组件 -->
      <uni-echarts
        ref="chengduMapChart"
        :option="mapChartOptions"
        canvasId="chengduMapChart"
        custom-class="map-chart"
      />
    </view>

    <!-- 给其他内容 section 动态绑定 class -->
    <view class="other-history-content" :class="{'blurred': isPopupOpen}">
      <text>这里是其他与历史发展相关的内容...</text>
      <view class="history-intro">
          <text>成都是中国历史文化名城，有着悠久的历史。自古以来，这片土地孕育了璀璨的文明，留下了丰富的历史遗迹和故事。探索成都各区的历史，可以帮助我们更好地理解这座城市的过去和现在。</text>
      </view>
    </view>

    <!-- 历史事件弹窗 (保持不变，它不受 history-map-container 模糊影响) -->
    <uni-popup ref="historyPopup" type="center" :mask-click="true" @change="onPopupChange">
        <!-- 弹窗内容容器 -->
        <view class="popup-content">
            <!-- 关闭按钮 -->
            <view class="close-button" @click="closePopup">×</view>

            <!-- 弹窗主标题 -->
            <text class="popup-main-title">
               「{{ selectedArea }}」{{ selectedEvent ? '历史事件详情' : '的历史事件列表' }}
            </text>

            <!-- 弹窗主要显示区域：列表 或 详情 -->
            <view class="popup-main-area">
                 <!-- 显示事件列表 -->
                 <view v-if="selectedEvent === null">
                     <view v-if="selectedArea && areaData[selectedArea] && areaData[selectedArea].length > 0" class="event-list-display">
                         <view
                           v-for="(event, index) in areaData[selectedArea]"
                           :key="index"
                           class="event-item-popup"
                           @click="selectEvent(event)"
                         >
                           <text class="event-item-title-popup">{{ event.title }}</text>
                         </view>
                     </view>
                     <view v-else-if="selectedArea" class="no-event-tip">
                         <text>暂无历史事件记录。</text>
                     </view>
                 </view>

                 <!-- 显示事件详情 -->
                 <view v-else>
                     <view class="event-detail-display">
                         <text class="event-detail-title-popup">{{ selectedEvent.title }}</text>
                         <scroll-view scroll-y class="event-detail-content-scroll">
                             <text class="event-detail-content-content">{{ selectedEvent.content }}</text>
                         </scroll-view>
                     </view>
                     <!-- 返回列表按钮 -->
                     <view class="back-button" @click="selectedEvent = null">
                         <text>返回列表</text>
                     </view>
                 </view>
            </view>
        </view>
    </uni-popup>

  </view>
</template>

<script>
// Script 部分保持不变，所有 JS 逻辑和数据都跟之前一样

// 引入 ECharts 核心库和需要的组件
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts'; // 2D 地图图表类型
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 引入 uni-echarts 组件
import uniEcharts from '@/uni_modules/xiaohe-echarts/components/uni-echarts/uni-echarts.vue';

// 引入 uni-popup 组件
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'

// 注册 ECharts 模块
echarts.use([
  MapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  CanvasRenderer
]);

export default {
  components: {
    uniEcharts,
    uniPopup
  },
  data() {
    return {
      mapChartOptions: null,
      chengduMapGeoJson: null,

      // 存储各区域的历史事件数据，每个区域对应一个事件对象数组
      // !!! 请确保这里的 content 字段已经手动清理，去除了开头的冗余部分 !!!
      areaData: {
        '锦江区': [
           { title: '大慈寺历史沿革', content: '大慈寺始建于隋开皇年间，唐玄宗曾在此剃度。唐宋时期为成都的佛教中心，香火鼎盛。现存寺庙多为清代重建。' },
           { title: '太古里片区变迁', content: '太古里片区原为大慈寺历史街区，近年来改造为融合古建筑与现代商业的特色街区，成为成都的时尚地标。太古里以保留大慈寺和广东会馆等历史建筑为特色，结合现代开放式街区设计，成为集购物、餐饮、文化、休闲为一体的城市空间。' }
        ],
        '青羊区': [
          { title: '青羊宫的由来', content: '青羊宫始建于周朝，现存建筑多为清代，因其殿内的二铜羊而闻名，是西南地区著名的道教宫观。相传老子曾在此讲道。现存建筑群布局紧凑，主要建筑有山门、三清殿、斗姆殿、八卦亭、玉皇殿等。' },
          { title: '金沙遗址发掘', content: '金沙遗址是商周时期（约公元前12世纪—公元前7世纪）古蜀文化遗址，2001年发现，出土大量珍贵文物，是古蜀文明研究的重要发现。金沙遗址出土了金器、玉器、铜器、石器、象牙等大量珍贵文物，其中太阳神鸟金饰是成都的城市形象标识。遗址博物馆展示了古蜀国的辉煌文明。' }
        ],
        '金牛区': [
          { title: '金牛道的传说', content: '相传秦惠文王欲伐蜀，欺骗蜀王献上五头石牛，并在牛尾放置黄金，蜀王信以为真，开山辟路迎牛，秦军趁机沿着此道入侵蜀国。此道后来称为金牛道。金牛道是中国古代连接关中和巴蜀地区的重要通道之一，也是军事要道和经济动脉。' }
        ],
        '武侯区': [
          { title: '武侯祠的创建', content: '武侯祠是纪念中国三国时期蜀汉丞相诸葛亮的祠庙。成都武侯祠是唯一的君臣合祀祠庙，由刘备的昭烈庙和诸葛亮的武侯祠组成。现存格局形成于清康熙十一年（1672年）。是全国重点文物保护单位。' },
          { title: '锦里古街', content: '锦里位于武侯祠旁，是一条以三国文化和川西民俗文化为主题的步行街，是成都著名旅游景点之一。锦里是在武侯祠旁延伸出的一条仿古街区，重现了三国时期和川西民居的风貌，集中了众多小吃、手工艺品和酒吧。' }
        ],
         '成华区': [
            { title: '东郊记忆片区历史', content: '东郊记忆（原东区音乐公园）是在原成都东郊老工业基地上改建而成，保留了部分工业建筑，融合了音乐、戏剧、艺术等元素，是城市有机更新的典范。这里曾是东方红电视机厂、红光电子管厂等老国营工厂的所在地，改造后成为集音乐、戏剧、摄影、设计等多种文化形态于一体的文化创意园区。' }
         ],
        '龙泉驿区': [ { title: '龙泉山城市森林公园规划', content: '龙泉山城市森林公园位于成都市东部，规划面积1275平方公里，是全球最大的城市森林公园之一，旨在打造世界级品质生活宜居地的重要生态基底。公园建设包括增绿增景、生态修复、步道体系、观景平台等，提升城市生态品质。' } ],
        '青白江区': [ { title: '成都国际铁路港建设', content: '成都国际铁路港是中国内陆对外开放的前沿，是“一带一路”倡议的重要节点，开行中欧班列、中亚班列等国际货运列车。铁路港集口岸通关、保税物流、多式联运、产业服务等功能于一体，是连接中国西部与欧洲、中亚等地区的重要陆路通道。' } ],
        '新都区': [ { title: '宝光寺千年历史', content: '宝光寺是中国佛教禅宗丛林寺院，始建于东汉，清代重建后规模宏大，是全国重点佛教寺院。宝光寺与文殊院、昭觉寺、草堂寺、大慈寺并称“成都五大禅院”，寺内有宝光塔、舍利塔等古迹。' } ],
        '温江区': [ { title: '温江撤县设区', content: '温江区原为温江县，2001年撤县设区，正式成为成都市的市辖区，城市化进程加快。撤县设区后，温江区加速融入成都市区发展，定位为成都市的生态居住区和现代化新城。' } ],
        '双流区': [ { title: '双流国际机场发展史', content: '成都双流国际机场是中国重要的航空枢纽，最初为空军机场，后改为民用，历经多次扩建，成为连接中国西部与世界的空中桥梁。机场始建于1938年，抗战时期曾是重要机场。改革开放后快速发展，T1、T2航站楼相继建成，跃升为国内繁忙机场之一。' }, { title: '黄龙溪古镇', content: '黄龙溪古镇有1700多年历史，清代便已形成村落，镇内古建筑保存较好，是国家4A级旅游景区。黄龙溪古镇保持了明清时期的街巷格局，建筑风格独特，以古街、古树、古庙、古水码头等“古”著称，是川西著名的古镇。' } ],
        '郫都区': [ { title: '郫县豆瓣酿制技艺', content: '郫县豆瓣以其独特的风味和传统的酿制工艺闻名，是川菜烹饪中不可或缺的调味品，其传统技艺被列入国家级非物质文化遗产名录。郫县豆瓣的制作需要经过选料、晒制、发酵等多道工序，周期长，工艺复杂，是手工技艺的传承。' }, { title: '望丛祠', content: '望丛祠是为纪念古蜀国两位开明时期君主——望帝杜宇和丛帝鳖灵而建的祠庙，是研究古蜀历史文化的重要实物资料。望丛祠占地面积较大，有牌坊、大门、蜀王殿、丛帝墓等建筑，是古蜀文化遗址的重要组成部分。' } ],
        '都江堰市': [ { title: '都江堰水利工程', content: '都江堰是中国古代建设并使用至今的大型水利工程，是全世界迄今为止年代最久、唯一留存、仍在一直使用以无坝引水为特征的宏大水利工程，体现了人与自然和谐相处。都江堰由鱼嘴、飞沙堰、宝瓶口等组成，科学地解决了岷江的引水、分洪、排沙等问题，使成都平原成为“天府之国”。' }, { title: '青城山道教文化', content: '青城山是中国道教发源地之一，是全国重点文物保护单位，与都江堰同为世界文化遗产。青城山分为前山和后山，前山以道教文化景观为主，后山以自然风光为主，是著名的旅游胜地。' } ],
        '彭州市': [ { title: '龙兴寺塔', content: '彭州龙兴寺塔为国家级文物保护单位，建于唐开元九年（公元721年），是四川省内少见的方形密檐式砖塔。龙兴寺塔高约25米，九级密檐式砖塔，造型古朴典雅，具有较高的历史和艺术价值。' } ],
        '邛崃市': [ { title: '平乐古镇', content: '平乐古镇是南方丝绸之路上的重要驿站，历史悠久，镇内“九古”风华，如古堰、古桥、古街、古寺等，是四川省历史文化名镇。平乐古镇依山傍水，古榕树、白沫江、青石板街、吊脚楼等构成了独特的川西水乡风情。' } ],
        '崇州市': [ { title: '街子古镇', content: '街子古镇地处邛崃山脉，是都江堰水利工程的源头之一，镇内有银杏、古楠等古树名木，有浓郁的川西民俗特色。街子古镇得名于明代，因附近有凤凰山，形如“倒街子”而得名。是集自然风光和古镇文化于一体的旅游目的地。' } ],
        '金堂县': [ { title: '五凤溪古镇', content: '五凤溪古镇坐落于沱江之畔，因其山形如五只凤凰而得名，是成都市唯一的客家古镇。五凤溪古镇是清代康熙年间由广东客家人迁入而形成，保留了客家文化和川西民居建筑特色，有独特的山水风光和人文景观。' } ],
        '简阳市': [ { title: '三岔湖', content: '三岔湖是都江堰灌溉工程中的一个大型水库，也是成都市重要的饮用水源地，湖区风光秀丽，有“西部百岛湖”之称。三岔湖水面开阔，岛屿众多，是成都市重要的水上运动和休闲度假区域，也是空港新城的重要组成部分。' } ],
        '蒲江县': [ { title: '西来古镇', content: '西来古镇是茶马古道上的重要一站，镇内保存有大量明清时期的川西民居建筑，尤其是12棵百年黄葛树形成的“古榕群”颇为壮观。西来古镇历史可追溯至宋代，镇内古街道、古建筑、古树、古寺庙保存完好，是典型的川西文化古镇。' } ],
        '大邑县': [
            { title: '西岭雪山', content: '西岭雪山因诗圣杜甫的绝句“窗含西岭千秋雪，门泊东吴万里船”而得名，是国家级风景名胜区，夏季是避暑胜地，冬季是滑雪天堂。西岭雪山主峰大雪塘海拔5364米，是成都第一高峰。景区内自然风光秀丽，有高山草甸、原始森林、瀑布、云海等景观。' },
            { title: '刘氏庄园博物馆', content: '刘氏庄园是旧中国大地主刘文彩的宅邸，是目前国内保存最完好的地主庄园之一，通过实物和展览，反映了旧社会农村阶级关系和剥削制度。刘氏庄园规模宏大，建筑豪华，占地7万多平方米，是研究中国半殖民地半封建社会农村阶级斗争的重要实例。' }
        ],
        '新津区': [ { title: '新津水运历史', content: '新津地处岷江要津，自古以来水运发达，是成都平原重要的物资集散地和交通枢纽，素有“五津之会”的美誉。新津因水而兴，历史上是重要的水码头城市，舟楫往来，商贾云集。现在依然是成都市南部重要的交通节点。' } ],
         // 请根据需要添加或完善其他区县的事件数据
      },

      selectedArea: null, // 当前选中的区域名称
      selectedEvent: null, // 当前选中的事件详情对象
      isPopupOpen: false // 记录弹窗是否打开的状态 (用于背景模糊)
    };
  },
  onReady() {
    this.loadChengduMapData();
  },
  methods: {
    /**
     * 加载成都GeoJSON地图数据
     */
    loadChengduMapData() {
      uni.request({
        url: '/static/map/chengdu.json', // ***请确保路径正确，且文件内容有效***
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.chengduMapGeoJson = res.data;
            // 在 ECharts 中注册地图，命名为 'chengdu'
            echarts.registerMap('chengdu', this.chengduMapGeoJson);
            // 初始化地图配置项和绑定事件
            this.initMapChartOptions();
          } else {
            uni.showToast({ title: '地图数据加载失败或为空', icon: 'none' });
             console.error('地图数据加载失败', res);
          }
        },
        fail: (err) => {
          console.error('地图请求失败', err);
          uni.showToast({ title: '地图请求失败', icon: 'none' });
        }
      });
    },

    /**
     * 初始化ECharts地图配置项
     */
    initMapChartOptions() {
       // 准备地图数据，这里只需要区域名称
      const mapData = Object.keys(this.areaData).map(name => ({
        name: name, // 区域名称，需要与 GeoJSON 中的名称匹配
        // value: 1 // 可以给个任意值，如果不需要 visualMap
      }));

      this.mapChartOptions = {
        title: {
        
          left: 'center',
          textStyle: { color: '#333', fontSize: 18 },
          subtextStyle: { color: '#aaa', fontSize: 12 }
        },
        tooltip: {
          trigger: 'item', // 数据项触发 tooltip
           confine: true, // 限制 tooltip 在图表区域内
          // ***修正这里的 formatter 函数，移除所有 HTML 标签***
          formatter: (params) => {
            // 确保是地图区域的数据项
            if (params.componentType === 'series' && params.seriesType === 'map' && params.data) {
              const areaName = params.name;
              const events = this.areaData[areaName]; // 获取该区域的事件数组
              // 使用 \n 进行换行，移除 <b> 标签
              let content = `${areaName}`; // 区域名称 (纯文本)
              if (events && events.length > 0) {
                 content += '\n历史事件：';
                 events.forEach(event => {
                     content += `\n- ${event.title}`;
                 });
              } else {
                 content += '\n暂无历史事件记录';
              }
              return content;
            }
            return '';
          }
        },
         // 如果需要视觉映射（颜色深浅），保留并配置；如果不需要，可以移除或 show: false
        // visualMap: { /* ... 配置 ... */ },
        series: [{
          name: '成都市行政区划', // 系列名称
          type: 'map', // 2D 地图类型
          map: 'chengdu', // 使用注册的地图名称 'chengdu'
          roam: true, // 开启鼠标缩放和平移漫游
          // scaleLimit: { min: 0.5, max: 5 }, // 可选：设置缩放范围

          label: { // 图上文字标签
            show: true, // 显示区域名称
            color: '#333', // 标签颜色
            fontSize: 10, // 标签字体大小
            // 可选：设置标签背景提高可读性
             backgroundColor: 'rgba(255,255,255,0.6)',
             padding: [2, 4],
             borderRadius: 2
          },
          itemStyle: { // 地图区域样式 - 默认颜色和边框
            borderColor: '#888', // 区域边框颜色，稍深一点
            borderWidth: 1, // 边框宽度
            areaColor: '#d3d3d3' // 区域填充颜色 (浅灰色，稍微调深一点)
          },
          emphasis: { // 高亮状态下的样式 (鼠标移入或选中)
            label: {
              show: true,
              color: '#000', // 高亮时标签颜色
              fontWeight: 'bold', // 高亮时标签加粗
              fontSize: 12 // 高亮时标签稍大一点
            },
            itemStyle: {
              // ***修改这里的颜色，选择一个与基础颜色对比更鲜明的颜色***
              areaColor: '#4682B4' // 钢蓝色作为高亮颜色
              // areaColor: '#FFA500' // 橙色也是一个不错的选择
            }
          },
          data: mapData // 地图数据 (只需要 name 属性)
        }]
      };

      this.$nextTick(() => {
          setTimeout(() => {
              const chartInstance = this.$refs.chengduMapChart?.chart;

              if (chartInstance) {
                  console.log('ECharts instance obtained, binding click event.');
                  chartInstance.off('click');
                  chartInstance.on('click', (params) => {
                      if (params.componentType === 'series' && params.seriesType === 'map' && params.data) {
                          const areaName = params.name;
                          console.log('Map area clicked:', areaName);

                          // 打开弹窗并设置选中的区域
                          this.selectedArea = areaName; // 设置选中的区域
                          this.selectedEvent = null; // ***清空选中的事件详情，确保先显示列表***
                          this.$refs.historyPopup.open('center'); // 打开弹窗
                      } else {
                         console.log('Clicked on non-area element or empty space:', params);
                      }
                  });

                   // 鼠标移入移出事件监听 (用于确认 emphasis 是否工作，但不在此手动控制颜色)
                   chartInstance.on('mouseover', (params) => {
                       if (params.componentType === 'series' && params.seriesType === 'map' && params.data) {
                           // console.log('Mouse over area:', params.name);
                       }
                   });

                   chartInstance.on('mouseout', (params) => {
                        if (params.componentType === 'series' && params.seriesType === 'map' && params.data) {
                            // console.log('Mouse out area:', params.name);
                        }
                   });

              } else {
                  console.error('Could not obtain ECharts instance from ref. Map chart might not render. Retrying...');
                   uni.showToast({ title: '地图组件初始化失败，请稍后重试', icon: 'none' });
              }
          }, 200);
      });
    },

    /**
     * 选择一个历史事件，显示其详细内容 (在弹窗内切换视图)
     * 这个方法在点击事件列表项时调用
     * @param {Object} event - 选中的历史事件对象 { title, content }
     */
    selectEvent(event) {
      console.log('Event selected:', event.title);
      this.selectedEvent = event; // 更新选中的事件数据，***这将触发 v-if 条件变化，显示详情区域***
    },

    /**
     * 关闭历史事件弹窗
     */
    closePopup() {
        this.$refs.historyPopup.close(); // 调用 uni-popup 的关闭方法
    },

    /**
     * 监听弹窗状态变化（打开/关闭）
     * @param {Object} e - 事件对象，包含 { show, type } 属性
     */
    onPopupChange(e) {
        console.log('Popup status changed:', e.show);
        this.isPopupOpen = e.show; // 更新弹窗打开状态 (用于背景模糊)

        if (!e.show) {
            // 弹窗关闭时，清除选中的区域和事件数据
            this.selectedArea = null;
            this.selectedEvent = null;
        }
    }
  }
};
</script>

<style scoped>
/* 页面容器样式 */
.history-map-container {
  padding: 15px;
  background-color: #f0f0f0;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /* ***背景模糊效果 CSS (已从这里移除)*** */
  /* transition: filter 0.3s ease; */
}

/* 将 blurred 类应用到需要模糊的具体内容块上 */
.map-chart-section.blurred,
.other-history-content.blurred {
  filter: blur(5px); /* 调整模糊的强度 */
  transition: filter 0.3s ease; /* 添加过渡效果 */
}


/* 地图区域的样式块 */
.map-chart-section {
  background-color: #fff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 图表标题样式 */
.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
  text-align: center;
}

/* **设置 uni-echarts 组件的高度** */
.map-chart {
    width: 100%;
    height: 450px;
    display: block;
}

/* 其他历史内容区域的样式 */
.other-history-content {
    background-color: #fff;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    line-height: 1.6;
    color: #666;
    font-size: 14px;
}

.history-intro {
    margin-top: 10px;
    text-indent: 2em;
}

/* --- uni-popup 弹窗内容及内部元素样式 --- */
.popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 85vw;
    max-height: 75vh;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    /* 确保弹窗内容在模糊背景上方 */
    z-index: 100; /* 设置一个较高的 z-index */
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 28px;
    color: #aaa;
    cursor: pointer;
    z-index: 10;
    padding: 5px;
    line-height: 1;
}

.close-button:active {
    color: #666;
}

/* 弹窗主标题样式 (列表和详情共用) */
.popup-main-title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    display: block;
    text-align: center;
    padding-right: 30px; /* 为关闭按钮留出右边距 */
}

/* 弹窗主要显示区域（列表或详情的容器） */
.popup-main-area {
    flex-grow: 1; /* 填充剩余空间 */
    overflow-y: auto; /* 如果内容超出高度，添加垂直滚动条 */
    /* 根据需要设置 max-height */
    max-height: calc(75vh - 80px); /* 示例计算，弹窗总高度 - 标题高度 - padding */
}

/* 弹窗内部事件列表样式 */
.event-list-display {
    /* 列表的容器样式 */
}

/* 弹窗内部事件列表项样式 */
.event-item-popup {
  background-color: #f8f8f8;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border: 1px solid #eee;
}

.event-item-popup:last-child {
    margin-bottom: 0;
}

.event-item-popup:active {
    background-color: #e0e0e0;
}

.event-item-title-popup {
  color: #555;
  font-weight: normal;
  font-size: 15px;
  display: block;
}

/* 弹窗内部事件详情样式 */
.event-detail-display {
    display: flex;
    flex-direction: column;
}

.event-detail-title-popup {
   color: #007bff;
   margin-bottom: 10px;
   font-size: 16px;
   text-align: left;
   padding-right: 0;
}

.event-detail-content-scroll {
    flex-grow: 1;
    min-height: 50px;
}

.event-detail-content-content { /* 修正 class name */
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap; /* 保留文本中的换行和空格 */
  word-break: break-word; /* 避免长文本溢出 */
  display: block;
}

/* 无事件提示样式 */
.no-event-tip {
    text-align: center;
    font-size: 15px;
    color: #666;
    padding: 20px;
}

/* 返回列表按钮样式 */
.back-button {
    margin-top: 15px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 8px;
    text-align: center;
    font-size: 15px;
    color: #555;
    transition: background-color 0.2s ease;
}

.back-button:active {
    background-color: #e0e0e0;
}

/* --- 遮罩模糊效果 (uni-popup 默认不带，需自行实现，此处为 CSS 示例，Uni-app 各端支持不同) --- */
/* .uni-mask { /* uni-popup 遮罩层的 class */
/*  backdrop-filter: blur(5px); /* 尝试毛玻璃效果 (CSS standard) */
/*  -webkit-backdrop-filter: blur(5px); /* Safari 支持 */
/*  } */
/* 请注意：以上 CSS 在 Uni-app 小程序/App 原生视图层可能不生效 */
/* 在 H5 端可能有效，但兼容性需测试 */

</style>