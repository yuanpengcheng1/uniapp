<template>
  <view class="container">
    <image class="background-image" src="/static/images/main/panda-bg.jpg" mode="aspectFill"></image>

    <view class="main-content">
      <view class="user-area">
        <view class="avatar-container">
          <image
            class="avatar"
            :src="isLoggedIn ? (userInfo.avatar || '/static/images/user/icons-login.png') : '/static/images/user/icons-login.png'"
            mode="aspectFill"
            @click="handleHeaderClick"
          />
        </view>

        <view class="login-status-text-area" @click="handleHeaderClick">
            <text v-if="!isLoggedIn" class="login-text">立即登录</text>
            <text v-else class="nickname">{{ userInfo.username || '用户' }}</text>
              <text v-if="isLoggedIn && userInfo.nickname" class="arrow">></text>
        </view>
      </view>


      <view class="menu-list">
        <view class="menu-item" @click="navigateToComments">
          <!-- 添加我的评论图标 -->
          <image src="/static/images/user/comments.png" class="menu-icon" mode="aspectFit"></image>
          <text class="item-text">我的评论</text>
          <text class="arrow">></text>
        </view>
        <view class="divider"></view>

        <view class="menu-item" @click="navigateToProfile">
          <!-- 添加编辑资料图标 -->
           <image src="/static/images/user/edit-profile.png" class="menu-icon" mode="aspectFit"></image>
          <text class="item-text">编辑资料</text>
          <text class="arrow">></text>
        </view>
        <view class="divider"></view>

        <view class="menu-item logout-item" @click="logout" v-if="isLoggedIn">
          <!-- 添加注销图标 -->
           <image src="/static/images/user/logout.png" class="menu-icon" mode="aspectFit"></image>
          <text class="item-text">注销</text>
          <!-- 注销通常不需要箭头 -->
          <!-- <text class="arrow">></text> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userInfo: {}
    };
  },
  methods: {
    // 点击头像或昵称区域的处理
    handleHeaderClick() {
      if (this.isLoggedIn) {
        // 已登录，跳转到个人信息页
        uni.navigateTo({ url: '/pages/me/edit-profile' });
      } else {
        // 未登录，跳转到登录页
        uni.navigateTo({ url: '/pages/me/login' });
      }
    },
    navigateToComments() {
      // 可以在这里加登录状态判断，或者在目标页判断
      uni.navigateTo({ url: '/pages/comments/my-comments' });
    },
    navigateToProfile() {
      // 可以在这里加登录状态判断
       uni.navigateTo({ url: '/pages/me/edit-profile' });
    },
    logout() {
      // 执行退出登录逻辑
      uni.removeStorageSync('userInfo');
      this.isLoggedIn = false;
      this.userInfo = {};
      uni.showToast({ title: '已退出登录', icon: 'success' });

       this.checkLoginStatus(); // 刷新当前页面的登录状态显示
    },
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo && userInfo.uid) {
        this.isLoggedIn = true;
        this.userInfo = userInfo;
        if (!this.userInfo.avatar) {
             this.userInfo.avatar = '/static/images/user/icons-login.png';
        }
         // 如果用户信息不包含 username 或 nickname，可以尝试从 userInfo 中获取或设置默认值
         if (!this.userInfo.username && userInfo.nickname) {
             this.userInfo.username = userInfo.nickname;
         } else if (!this.userInfo.username) {
             this.userInfo.username = '用户';
         }

      } else {
        this.isLoggedIn = false;
        this.userInfo = {}; // 清空用户信息
      }
    }
  },
  onShow() {
    // 页面显示时检查登录状态
    this.checkLoginStatus();
  }
};
</script>
<style lang="scss" scoped>
page {
  background-color: #f4f7f6; // 页面背景色
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: transparent; // 让背景图片显示出来
  padding-bottom: env(safe-area-inset-bottom);
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 700rpx;	
  z-index: 1;
  filter: blur(2rpx); // 可以增加一点模糊效果，突出悬浮感 (可选)
}

.main-content {
  position: relative;
  z-index: 2;
  margin-top: 500rpx; // 调整上边距，留出更多背景空间
  margin-left: 30rpx; // 左右增加外边距，形成悬浮的宽度
  margin-right: 30rpx;
  background-color: #fff;
  border-radius: 20rpx; // 增加圆角
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1); // 更明显的阴影效果
  padding-top: 120rpx; // 调整 padding-top，适应头像位置
  padding-bottom: 30rpx;
}

.user-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx; // 稍微减小与菜单的间距
}

.avatar-container {
  position: absolute;
  top: -75rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  overflow: hidden;
}
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #fff; /* 将背景色改为白色，与边框一致 */
  border: 4rpx solid #fff;
  box-sizing: border-box;
  display: flex; /* 使用 flex 布局 */
  justify-content: center; /* 水平居中图标 */
  align-items: center; /* 垂直居中图标 */
}


.login-status-text-area {
  text-align: center;
  margin-top: 10rpx;
}

.login-text {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  vertical-align: middle;
}

.nickname {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  vertical-align: middle;
}

.arrow {
  font-size: 30rpx;
  color: #ccc;
  margin-left: 10rpx;
  vertical-align: middle;
}

/* 功能列表样式 */
.menu-list {
  padding: 0 30rpx;
}

.menu-item {
  display: flex; /* 明确设置 Flex 布局 */
  flex-direction: row; /* 明确设置主轴方向为水平 */
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  font-size: 32rpx;
  color: #333;
  background-color: #fff; // 确保背景是白色
  cursor: pointer;

  &:active {
    background-color: #f8f8f8;
  }
}

/* 新增：菜单项图标样式 */
.menu-icon {
    width: 36rpx; // 将图标宽度调整为 36rpx
    height: 36rpx; // 将图标高度调整为 36rpx
    margin-right: 20rpx; // 图标与文本的间距保持
    flex-shrink: 0; /* 防止图标在空间不足时被挤压 */
}


.item-text {
  flex: 1; // 文本占据剩余空间，将箭头推到最右边
}

// 分割线
.divider {
  height: 1rpx;
  background-color: #eee;
  margin: 0;
}

.logout-item {
  color: #333; /* 可以保持与其他文字颜色一致，或者根据设计调整 */
}
/* 如果注销按钮的文字需要变红，可以在这里修改 */
/*
.logout-item .item-text {
  color: #f00; // 红色文字表示危险操作
}
*/
</style>