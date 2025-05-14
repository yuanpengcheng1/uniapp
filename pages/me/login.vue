<template>
  <view class="container">
    <view class="header">
      
    </view>

    <view class="login-form">
      <form @submit="formSubmit" @reset="formReset">
        <view class="form-item">
          <text class="label">用户名</text>
          <input
            class="input"
            type="text"
            name="uname"
            placeholder="请输入用户名"
            v-model="loginForm.uname"
          />
        </view>
        <view class="form-item">
          <text class="label">密码</text>
          <input
            class="input"
            type="password"
            name="upassword"
            placeholder="请输入密码"
            v-model="loginForm.upassword"
          />
        </view>
        <view class="button-group">
          <button type="primary" form-type="submit" class="submit-button">
            登录
          </button>
          <button type="default" form-type="reset" class="reset-button">
            重置
          </button>
        </view>
        <view class="register-link" @click="navigateToRegister">
          没有账号？去注册
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import { loginByName } from '../../request/Api.js';

export default {
  data() {
    return {
      loginForm: {
        uname: '',
        upassword: ''
      }
    };
  },
  methods: {
    formSubmit(e) {
      const formdata = e.detail.value;
      console.log('提交表单数据:', formdata);

      // 校验用户名和密码是否为空
      if (!formdata.uname || !formdata.upassword) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        });
        return;
      }

      // 调用登录接口
      loginByName(formdata)
        .then(res => {
          if (res.code === '200' && res.data != null) {
            // 从响应中获取完整的用户信息，包括头像
            const userInfo = {
              uid: res.data.uid,
              username: res.data.username || formdata.uname,
              avatar: res.data.avatar || '/static/images/user/icons-login.png'
            };

            console.log('即将保存到本地存储的 userInfo:', userInfo); // 打印 userInfo

            new Promise((resolve) => {
              uni.setStorageSync('userInfo', userInfo);
              resolve();
            }).then(() => {
              const savedUserInfo = uni.getStorageSync('userInfo');
              console.log('保存到本地存储的用户信息:', savedUserInfo); // 验证保存结果

              uni.showToast({
                title: '登录成功',
                icon: 'success'
              });

              console.log('准备跳转到首页');
              uni.switchTab({
                url: '/pages/index/index'
              });
              console.log('已经尝试跳转到首页');
            });

          } else {
            uni.showToast({
              title: res.msg || '登录失败，请检查用户名或密码',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('请求出错:', err);
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
        });
    },
    formReset() {
      console.log('重置表单');
      this.loginForm = {
        uname: '',
        upassword: ''
      };
    },
    navigateToRegister() {
      uni.navigateTo({
        url: '/pages/me/register'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); /* 更柔和的渐变 */
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 30px;
}

.header {
  position: absolute;
  top: 40px; /* 稍微上移 */
  left: 40px; /* 稍微左移 */
  z-index: 10;
  color: #00897b; /* 更柔和的深青色 */
  font-weight: 600; /* 稍细的字重 */
  font-size: 26px; /* 稍小的标题 */
  letter-spacing: 0.3px;
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    color: #00acc1;
    transform: scale(1.03);
  }
}

.login-form {
  background-color: rgba(255, 255, 255, 0.85); /* 更高的透明度 */
  padding: 40px; /* 缩小内边距 */
  border-radius: 16px; /* 更柔和的圆角 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* 更轻的阴影 */
  width: 90%;
  max-width: 400px; /* 缩小最大宽度 */
  z-index: 5;
  opacity: 0;
  transform: translateY(15px);
  animation: fadeInUp 0.4s ease-out forwards 0.2s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item {
  margin-bottom: 25px; /* 缩小间距 */
}

.label {
  font-size: 16px; /* 缩小标签字体 */
  color: #00695c; /* 更柔和的深青色 */
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input {
  border: none;
  border-bottom: 2px solid #80cbc4; /* 更细的底部边框 */
  padding: 12px 0; /* 缩小垂直内边距 */
  font-size: 16px; /* 缩小输入框字体 */
  color: #333;
  width: 100%;
  outline: none;
  background: transparent;
  transition: border-bottom-color 0.3s ease;

  &:focus {
    border-bottom-color: #26a69a;
  }
}

.button-group {
  display: flex;
  gap: 15px; /* 缩小按钮间距 */
  margin-top: 35px; /* 缩小上边距 */
}

.submit-button {
  flex: 1;
  background-color: #26a69a; /* 更清新的主按钮颜色 */
  color: #fff;
  border: none;
  border-radius: 8px; /* 更小的圆角 */
  padding: 14px; /* 缩小内边距 */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #00897b;
    transform: translateY(-1px); /* 更小的位移 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 更轻的阴影 */
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}

.reset-button {
  flex: 1;
  background-color: transparent;
  color: #26a69a; /* 更清新的文字颜色 */
  border: 2px solid #26a69a; /* 更细的边框 */
  border-radius: 8px; /* 更小的圆角 */
  padding: 12px; /* 缩小内边距 */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #e0f7fa;
    color: #00897b;
    transform: translateY(-1px); /* 更小的位移 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 更轻的阴影 */
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}

.register-link {
  text-align: center;
  margin-top: 30px; /* 缩小上边距 */
  color: #00bcd4;
  font-size: 14px; /* 缩小字体 */
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease-in-out;

  &:hover {
    color: #26a69a;
    transform: scale(1.02); /* 更小的放大 */
  }
}

/* 更轻盈的背景装饰元素 */
.bg-element {
  position: absolute;
  background: linear-gradient(45deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 150, 136, 0.05) 100%); /* 更淡的颜色 */
  border-radius: 50%; /* 更圆 */
  filter: blur(80px); /* 更小的模糊 */
  opacity: 0.6;
  transition: transform 0.4s ease-in-out;

  &:hover {
    transform: scale(1.08);
  }
}

.bg-element-1 {
  width: 280px; /* 更小 */
  height: 280px; /* 更小 */
  top: -30px;
  right: -60px;
}

.bg-element-2 {
  width: 320px; /* 更小 */
  height: 320px; /* 更小 */
  bottom: -80px;
  left: -100px;
}

.bg-element-3 {
  width: 200px; /* 更小 */
  height: 200px; /* 更小 */
  top: 55%;
  right: 15%;
}
</style>