<template>
  <view class="home-container">
    <!-- 顶部区域 -->
    <!-- 可以根据需要替换成搜索框等 -->
    <view class="header">
      <text class="header-title">蓉城发展概览</text>
    
      <!-- <view class="search-box">
        <input class="search-input" placeholder="搜索历史、地标、规划..." />
        <image src="/static/icons/search.png" class="search-icon"></image>
      </view> -->
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

    <!-- 快捷功能模块 -->
    <view class="section-block">
      <view class="function-grid">
        <view
          class="function-item"
          v-for="(item, index) in functions"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <!-- 图标背景 -->
          <view class="icon-wrapper">
             <image :src="item.icon" class="icon" mode="aspectFit" />
          </view>
          <text class="label">{{ item.label }}</text>
        </view>
      </view>
    </view>


    <!-- 历史发展主题模块 (模仿行程攻略) -->
    <view class="section-block">
       <view class="section-title">
          <text>历史发展主题</text>
          <text class="section-more">全部 ></text>
       </view>
       <scroll-view class="theme-cards-scroll" scroll-x>
          <view class="theme-card" v-for="(item, index) in historyThemes" :key="index" @click="navigateTo(item.url)">
             <image :src="item.imgUrl" class="card-img" mode="aspectFill"></image>
             <view class="card-text">
                 <text class="card-title">{{ item.title }}</text>
                 <text class="card-subtitle">{{ item.subtitle }}</text>
             </view>
          </view>
       </scroll-view>
    </view>

    <!-- 发展数据快览模块 -->
    <view class="section-block">
       <view class="section-title">
          <text>发展数据快览</text>
          <!-- 将这里的text改为可点击，并绑定 navigateToChartsPage 方法 -->
          <text class="section-more" @click="navigateToChartsPage">更多 ></text>
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
           <!-- 可以添加更多数据项 -->
       </view>
    </view>

     <!-- 重点建设成果模块 (简化为列表) -->
    <view class="section-block">
       <view class="section-title">
          <text>重点建设成果</text>
          <text class="section-more">更多 ></text>
       </view>
       <view class="construction-list">
           <view class="construction-item" v-for="(item, index) in constructionList" :key="index" @click="navigateTo(item.url)">
               <text class="item-label">{{ item.label }}</text>
               <text class="item-arrow">></text>
           </view>
       </view>
    </view>


     <!-- 历史文化讲堂模块 (简化为列表) -->
    <view class="section-block">
       <view class="section-title">
          <text>历史文化讲堂</text>
          <text class="section-more">全部 ></text>
       </view>
        <view class="culture-list">
           <view class="culture-item" v-for="(item, index) in cultureTopics" :key="index" @click="navigateTo(item.url)">
              <image :src="item.imgUrl" class="culture-img" mode="aspectFill"></image>
               <view class="culture-info">
                   <text class="culture-title">{{ item.title }}</text>
                   <text class="culture-source">{{ item.source }}</text>
               </view>
                <text class="item-arrow">></text>
           </view>
       </view>
    </view>


  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        { imgUrl: '/static/images/banners/banner1.jpg' }, // 替换成符合发展主题的图片
        { imgUrl: '/static/images/banners/banner2.jpg' },
        { imgUrl: '/static/images/banners/banner3.jpg' }
      ],
      functions: [
        {
          label: '城区管理',
          icon: '/static/images/main/district-manage(已去底).png', // 替换图标
          url: '/pages/district/manage'
        },
        {
          label: '发展历史',
          icon: '/static/images/main/history-dev(已去底).png', // 替换图标
          url: '/pages/history/manage' // 或跳转到展示页
        },
        {
          label: '城市规划', // 新增功能
          icon: '/static/images/main/city-plan(已去底).png', // 替换图标
          url: '/pages/plan/index'
        },
        {
          label: '招商引资', // 新增功能
          icon: '/static/images/main/invest(已去底).png',
           url: '/pages/invest/index' // 为招商引资添加url
        },
        {
          label: '数据统计', // 新增功能
          icon: '/static/images/main/data-stats(已去底).png', // 替换图标
          url: '/pages/stats/index'
        },
         {
          label: '政策法规', // 新增功能
          icon: '/static/images/main/policy(已去底).png', // 替换图标
          url: '/pages/policy/index'
        },
         {
          label: '地标建筑', // 新增功能
          icon: '/static/images/main/landmark(已去底).png', // 替换图标
          url: '/pages/landmark/index'
        },
         {
          label: '历史文化', // 新增功能
          icon: '/static/images/main/culture(已去底).png', // 替换图标
          url: '/pages/culture/index'
        },
      ],
      historyThemes: [ // 历史发展主题数据
          {
              id: 1,
              imgUrl: '/static/images/themes/theme1.jpg', // 替换图片 (如：金沙遗址图片)
              title: '古蜀文明探源',
              subtitle: '金沙遗址与宝墩文化',
              url: '/pages/history/detail?id=1'
          },
           {
              id: 2,
              imgUrl: '/static/images/themes/theme2.jpg',
              title: '秦汉筑城建都',
              subtitle: '少城与大城格局初现',
              url: '/pages/history/detail?id=2'
          },
           {
              id: 3,
              imgUrl: '/static/images/themes/theme3.jpg', // 替换图片 (如：唐宋商业街景)
              title: '盛唐繁华都市',
              subtitle: '扬一益二的商业传奇',
              url: '/pages/history/detail?id=3'
          },
          // 添加更多主题...
      ],
      constructionList: [ // 重点建设成果数据
          {
              id: 1,
              label: '天府国际机场建设',
              url: '/pages/construction/detail?id=1'
          },
          {
              id: 2,
              label: '轨道交通线网扩张',
              url: '/pages/construction/detail?id=2'
          },
           {
              id: 3,
              label: '东部新区发展蓝图',
              url: '/pages/construction/detail?id=3'
          },
           {
              id: 4,
              label: '公园城市绿道建设',
              url: '/pages/construction/detail?id=4'
          },
          // 添加更多项目...
      ],
       cultureTopics: [ // 历史文化讲堂数据
          {
              id: 1,
              imgUrl: '/static/images/culture/culture1.jpg', // 替换图片 (如：都江堰图片)
              title: '都江堰的治水智慧',
              source: '讲堂系列一',
              url: '/pages/culture/detail?id=1'
          },
           {
              id: 2,
              imgUrl: '/static/images/culture/culture2.jpg', // 替换图片 (如：川剧变脸图片)
              title: '川剧艺术的传承与发展',
              source: '讲堂系列二',
              url: '/pages/culture/detail?id=2'
          },
          // 添加更多讲堂...
       ]
    };
  },
  methods: {
    navigateTo(url) {
      if(url) { // 避免空url跳转
         uni.navigateTo({ url });
      } else {
          console.warn('Navigation URL is not defined for this item.');
          // 可以给用户一个提示，比如 uni.showToast({ title: '功能待开放', icon: 'none' });
      }
    },
    // 新增方法：跳转到图表页面
    navigateToChartsPage() {
      uni.navigateTo({
        url: '/pages/charts/index' // 指定新页面的路径
      });
    }
  }
};
</script>

<style scoped>
/* 全局背景 */
.home-container {
  background-color: #f5f5f5; /* 浅灰色背景 */
  min-height: 100vh;
  padding-bottom: 20px; /* 底部留白 */
}

/* 顶部区域样式 */
.header {
    padding: 15px 20px;
    background-color: #ffffff; /* 白色背景 */
    /* 可以根据需要调整颜色 */
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    margin-bottom: 15px; /* 与下方轮播图的间距 */
    display: flex;
    align-items: center;
    justify-content: center; /* 标题居中 */
}
.header-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
/* 搜索框样式 (如果启用) */
/*
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
*/


/* 轮播图样式 */
.banner {
  height: 160px;
  padding: 0 10px; /* 左右内边距，让圆角露出来 */
  box-sizing: border-box;
}

.banner-img {
  width: 100%;
  height: 100%;
  border-radius: 12px; /* 圆角 */
  object-fit: cover; /* 保持图片比例覆盖容器 */
}

/* Section 容器样式 (用于模块分组，提供统一的外边距和背景) */
.section-block {
    background-color: #fff;
    margin: 15px 10px 0; /* 上、左右、下外边距 */
    padding: 15px 10px; /* 内边距 */
    border-radius: 12px; /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
}

/* Section 标题样式 */
.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px; /* 标题与内容的间距 */
    margin-bottom: 10px; /* 与下方内容的间距 */
    border-bottom: 1px solid #eee; /* 分隔线 */
}
.section-title text:first-child {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}
.section-more {
    font-size: 12px;
    color: #999;
    /* 添加点击效果 */
    /* 可以通过伪类 :active 或 :hover 添加 */
}


/* 快捷功能模块样式 */
.function-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 改为左对齐，更像示例图 */
   padding-top: 10px; /* 与标题分隔线的间距 */
}

.function-item {
  width: 25%; /* 调整宽度，使其在一行显示4个或更多 */
  margin-bottom: 15px; /* 底部间距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* 文字居中 */
}
.icon-wrapper {
    width: 50px; /* 图标容器大小 */
    height: 50px;
    /* 将这里的背景色从 #e0f0e3 改为白色或其他颜色 */
    background-color: #ffffff; /* 方案一：改为白色 */
    /* 或者 */
    /* background-color: #f8f8f8; */ /* 方案二：改为非常浅的灰色 */
    /* 或者，如果您想完全去掉圆形背景，可以注释掉或删除 background-color 这一行 */
    /* background-color: transparent; */


    border-radius: 50%; /* 圆形背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px; /* 图标与文字间距 */
     /* 可以添加一个细边框，增加层次感 */
     /* border: 1px solid #eee; */
}
.icon {
  width: 30px; /* 图标实际大小 */
  height: 30px;
}

.label {
  font-size: 12px; /* 调整字体大小 */
  color: #333;
  padding: 0 5px; /* 防止文字过长溢出 */
}


/* 历史发展主题模块样式 (横向滚动卡片) */
.theme-cards-scroll {
    white-space: nowrap; /* 关键：使内容不换行 */
    width: 100%;
}

.theme-card {
    display: inline-block; /* 使卡片水平排列 */
    width: 150px; /* 卡片宽度 */
    margin-right: 10px; /* 卡片间距 */
    border-radius: 10px;
    overflow: hidden; /* 确保图片圆角 */
    position: relative; /* 用于文字叠加 */
    background-color: #fff; /* 防止图片未加载时的空白 */
     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.theme-card:last-child {
    margin-right: 0; /* 最后一个卡片无右侧间距 */
}

.card-img {
    width: 100%;
    height: 100px; /* 图片高度 */
    display: block; /* 消除图片底部的额外空间 */
    object-fit: cover;
}

.card-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)); /* 底部渐变蒙层 */
    padding: 10px;
    color: #fff;
}
.card-title {
    display: block;
    font-size: 14px;
    font-weight: bold;
    white-space: normal; /* 允许换行 */
    overflow: hidden;
    text-overflow: ellipsis;
     margin-bottom: 2px;
}
.card-subtitle {
    display: block;
    font-size: 10px;
     white-space: normal; /* 允许换行 */
     overflow: hidden;
    text-overflow: ellipsis;
    color: #ddd;
}

/* 发展数据快览模块样式 */
.data-overview-card {
    display: flex;
    justify-content: space-around; /* 数据项均匀分布 */
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
    color: #1c85e5; /* 蓝色强调色 */
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
    border-bottom: none; /* 最后一个无底线 */
}
.item-label {
    font-size: 14px;
    color: #333;
     flex: 1; /* 占据剩余空间 */
}
.item-arrow {
    font-size: 14px;
    color: #999;
    margin-left: 10px; /* 箭头左侧间距 */
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