<template>
  <view class="home-container">
    <view class="header">
      <text class="header-title">蓉城发展概览</text>
      <view class="search-box">
        <input class="search-input" placeholder="搜索历史、地标、规划..." />
        <image src="/static/icons/search.png" class="search-icon"></image>
      </view>
    </view>

    <swiper
      class="banner"
      indicator-dots
      autoplay
      circular
      interval="3000"
      duration="500"
    >
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.imgUrl" class="banner-img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="section-block">
      <view class="function-grid">
        <view
          class="function-item"
          v-for="(item, index) in functions"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <view class="icon-wrapper">
            <image :src="item.icon" class="icon" mode="aspectFit" />
          </view>
          <text class="label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="section-block">
      <view class="section-title">
        <text>历史发展主题</text>
        <text class="section-more">全部 ></text>
      </view>
      <scroll-view class="theme-cards-scroll" scroll-x>
        <view
          class="theme-card"
          v-for="(item, index) in historyThemes"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.imgUrl" class="card-img" mode="aspectFill"></image>
          <view class="card-text">
            <text class="card-title">{{ item.title }}</text>
            <text class="card-subtitle">{{ item.subtitle }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="section-block">
      <view class="section-title">
        <text>发展数据快览</text>
        <text class="section-more" @click="navigateToChartsPage">全部 ></text>
      </view>
      <view class="data-overview-card">
        <view class="data-item">
          <text class="data-value">2100万+</text>
          <text class="data-label">常住人口 (2024)</text>
        </view>
        <view class="data-item">
          <text class="data-value">2.3万亿+</text>
          <text class="data-label">GDP (2024)</text>
        </view>
        </view>
    </view>

    <view class="section-block">
      <view class="section-title">
        <text>重点建设成果</text>
        <text class="section-more">更多 ></text>
      </view>
      <view class="construction-list">
        <view
          class="construction-item"
          v-for="(item, index) in constructionList"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <text class="item-label">{{ item.label }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <view class="section-block">
      <view class="section-title">
        <text>历史文化讲堂</text>
        <text class="section-more" @click="navigateToLecture">全部 ></text>
      </view>
      <view class="culture-list">
        <view
          class="culture-item"
          v-for="(item, index) in cultureTopics"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.imgUrl" class="culture-img" mode="aspectFill"></image>
          <view class="culture-info">
            <text class="culture-title">{{ item.title }}</text>
            <text class="culture-source">{{ item.source }}</text>
          </view>
          <text class="item-arrow">></text>
        </view>
        <view v-if="cultureTopics.length === 0" class="no-data-tip">
          <text>暂无历史文化讲堂信息</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { listByType } from '../../request/Api.js';

export default {
  data() {
    return {
      banners: [
        { imgUrl: '/static/images/banners/banner1.jpg' },
        { imgUrl: '/static/images/banners/banner2.jpg' },
        { imgUrl: '/static/images/banners/banner3.jpg' },
      ],
      functions: [
        {
          label: '城区管理',
          icon: '/static/images/main/district-manage(已去底).png',
          url: '/pages/district/manage',
        },
        {
          label: '发展历史',
          icon: '/static/images/main/history-dev(已去底).png',
          url: '/pages/history/manage',
        },
        {
          label: '城市规划',
          icon: '/static/images/main/city-plan(已去底).png',
          url: '/pages/plan/index',
        },
        {
          label: '招商引资',
          icon: '/static/images/main/invest(已去底).png',
          url: '/pages/invest/index',
        },
        {
          label: '数据统计',
          icon: '/static/images/main/data-stats(已去底).png',
          url: '/pages/stats/index',
        },
        {
          label: '政策法规',
          icon: '/static/images/main/policy(已去底).png',
          url: '/pages/policy/index',
        },
        {
          label: '地标建筑',
          icon: '/static/images/main/landmark(已去底).png',
          url: '/pages/landmark/index',
        },
        {
          label: '历史文化',
          icon: '/static/images/main/culture(已去底).png',
          url: '/pages/culture/index',
        },
      ],
      historyThemes: [
        {
          id: 1,
          imgUrl: '/static/images/themes/theme1.jpg',
          title: '古蜀文明探源',
          subtitle: '金沙遗址与宝墩文化',
          url: '/pages/history/detail?id=1',
        },
        {
          id: 2,
          imgUrl: '/static/images/themes/theme2.jpg',
          title: '秦汉筑城建都',
          subtitle: '少城与大城格局初现',
          url: '/pages/history/detail?id=2',
        },
        {
          id: 3,
          imgUrl: '/static/images/themes/theme3.jpg',
          title: '盛唐繁华都市',
          subtitle: '扬一益二的商业传奇',
          url: '/pages/history/detail?id=3',
        },
      ],
      constructionList: [
        {
          id: 1,
          label: '天府国际机场建设',
          url: '/pages/construction/detail?id=1',
        },
        {
          id: 2,
          label: '轨道交通线网扩张',
          url: '/pages/construction/detail?id=2',
        },
        {
          id: 3,
          label: '东部新区发展蓝图',
          url: '/pages/construction/detail?id=3',
        },
        {
          id: 4,
          label: '公园城市绿道建设',
          url: '/pages/construction/detail?id=4',
        },
      ],
      // 将 cultureTopics 初始化为空数组
      cultureTopics: [],
      selectedType: 'lecture', // 这个 selectedType 仍然用于 fetchHistoryEvents
    };
  },
  onLoad() {
    // 在页面加载时调用方法获取数据
    this.fetchHistoryEvents();
  },
  methods: {
    fetchHistoryEvents() {
      console.log('准备请求历史事件类型：', this.selectedType);
      listByType(this.selectedType)
        .then(res => {
          console.log('接口完整返回：', res);
          if (res && res.statusCode === 200 && res.data && res.data.code == 200) {
            let result = res.data.data;
            console.log('接口返回数据 (业务码 200)：', result);

            if (result && Array.isArray(result) && result.length > 0) {
              console.log('成功获取到讲堂数据:', result);

              // 1. 使用 updateTime 字段进行排序
              // 2. 按照 updateTime 降序排序（最新的在前面）
              result.sort((a, b) => {
                // 直接比较 Date 对象
                if (a.updateTime && b.updateTime) {
                  if (a.updateTime instanceof Date && b.updateTime instanceof Date) {
                    return b.updateTime.getTime() - a.updateTime.getTime();
                  } else {
                    console.warn('updateTime is not a Date object', a.updateTime, b.updateTime);
                    return 0;
                  }
                } else if (a.updateTime) {
                  console.warn('b.updateTime is undefined', b);
                  return -1;
                } else if (b.updateTime) {
                  console.warn('a.updateTime is undefined', a);
                  return 1;
                } else {
                  return 0;
                }
              });

              // 3. 截取最新的四条数据
              const latestCultureTopics = result.slice(0, 4);

              // 转换数据格式，匹配前端 cultureTopics 的结构
              this.cultureTopics = latestCultureTopics.map(item => ({
                id: item.id,
                imgUrl: item.imgUrl,
                title: item.title,
                source: item.eventDate, // 后端的 eventDate 对应前端的 source
                url: `/pages/culture/detail?id=${item.id}`,
              }));

              uni.setStorageSync('cultureTopics', this.cultureTopics);

              uni.showToast({
                title: '讲堂信息加载成功',
                icon: 'success',
              });
            } else {
              console.warn('业务码 200，但无匹配讲堂数据或数据格式不正确', res.data);
              this.cultureTopics = [];
              uni.setStorageSync('cultureTopics', []);
              uni.showToast({
                title: '未找到相关讲堂信息',
                icon: 'none',
              });
            }
          } else {
            console.warn('接口返回业务错误或状态码非200:', res.data);
            this.cultureTopics = [];
            uni.setStorageSync('cultureTopics', []);
            uni.showToast({
              title: res.data && res.data.msg ? res.data.msg : '加载讲堂信息失败',
              icon: 'none',
            });
          }
        })
        .catch(err => {
          console.error('请求出错:', err);
          this.cultureTopics = [];
          uni.setStorageSync('cultureTopics', []);
          uni.showToast({
            title: '网络错误，无法加载讲堂信息',
            icon: 'none',
          });
        });
    },
    navigateTo(url) {
      if (url) {
        uni.navigateTo({ url });
      } else {
        console.warn('Navigation URL is not defined for this item.');
      }
    },
    navigateToChartsPage() {
      uni.navigateTo({
        url: '/pages/charts/index',
      });
    },
    navigateToLecture() {
      uni.switchTab({
        url: '/pages/list/list',
      });
    },
  },
};
</script>

<style scoped>
/* 全局背景 */
.home-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部区域样式 */
.header {
  padding: 15px 20px;
  background-color: #ffffff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
/* 搜索框样式 (如果启用) */

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 5px 10px;
  margin-left: 15px;
}
.search-input {
  flex: 1;
  font-size: 14px;
  margin-right: 5px;
}
.search-icon {
  width: 20px;
  height: 20px;
}

.no-data-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
/* 轮播图样式 */
.banner {
  height: 160px;
  padding: 0 10px;
  box-sizing: border-box;
}

.banner-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

/* Section 容器样式 (用于模块分组，提供统一的外边距和背景) */
.section-block {
  background-color: #fff;
  margin: 15px 10px 0;
  padding: 15px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Section 标题样式 */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.section-title text:first-child {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.section-more {
  font-size: 12px;
  color: #999;
}

/* 快捷功能模块样式 */
.function-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 10px;
}

.function-item {
  width: 25%;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.icon-wrapper {
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}
.icon {
  width: 30px;
  height: 30px;
}

.label {
  font-size: 12px;
  color: #333;
  padding: 0 5px;
}

/* 历史发展主题模块样式 (横向滚动卡片) */
.theme-cards-scroll {
  white-space: nowrap;
  width: 100%;
}

.theme-card {
  display: inline-block;
  width: 150px;
  margin-right: 10px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.theme-card:last-child {
  margin-right: 0;
}

.card-img {
  width: 100%;
  height: 100px;
  display: block;
  object-fit: cover;
}

.card-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  padding: 10px;
  color: #fff;
}
.card-title {
  display: block;
  font-size: 14px;
  font-weight: bold;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}
.card-subtitle {
  display: block;
  font-size: 10px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ddd;
}

/* 发展数据快览模块样式 */
.data-overview-card {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.data-value {
  font-size: 16px;
  font-weight: bold;
  color: #1c85e5;
  margin-bottom: 3px;
}
.data-label {
  font-size: 12px;
  color: #666;
}

/* 重点建设成果模块样式 (列表) */
.construction-list .construction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.construction-list .construction-item:last-child {
  border-bottom: none;
}
.item-label {
  font-size: 14px;
  color: #333;
  flex: 1;
}
.item-arrow {
  font-size: 14px;
  color: #999;
  margin-left: 10px;
}

/* 历史文化讲堂模块样式 (带图片的列表) */
.culture-list .culture-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.culture-list .culture-item:last-child {
  border-bottom: none;
}
.culture-img {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  margin-right: 10px;
  object-fit: cover;
}
.culture-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.culture-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}
.culture-source {
  font-size: 11px;
  color: #999;
}
</style>
