<template>
  <view class="container">
    <view class="register-form">
      <form @submit="formSubmit" @reset="formReset">
        <view class="form-item">
          <text class="label">用户名</text>
          <input class="input" name="uname" placeholder="请输入用户名" />
        </view>
        <view class="form-item">
          <text class="label">登录名</text>
          <input class="input" name="uloginname" placeholder="请输入登录名" />
        </view>
        <view class="form-item">
          <text class="label">密码</text>
          <input class="input" type="password" name="upassword" placeholder="请输入密码" />
        </view>
        <view class="form-item">
          <text class="label">用户类型</text>
          <!-- Picker 组件本身没有 name 属性用于 form 提交 -->
          <picker :range="userTypes" :value="utypeIndex" @change="userTypeChange" range-key="label">
            <view class="input">{{ userTypes[utypeIndex].label }}</view>
          </picker>
          <!-- 方式一：如果 Picker 不支持直接 name，可以考虑隐藏的 input 来传递值 (不推荐Picker) -->
          <!-- <input type="hidden" name="utype" :value="userTypes[utypeIndex].value" /> -->
          <!-- 方式二：手动在 submit 方法中添加 (当前采用此方式) -->
        </view>
        <view class="button-group">
          <button form-type="submit" type="primary" class="submit-button">注册</button>
          <button type="default" form-type="reset" class="reset-button">重置</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import { addUser } from '../../request/Api.js';

export default {
    data() {
        return {
            userTypes: [
                { label: '普通用户', value: '0' }, // 这里的 value 对应后端 utype 的值
                { label: '管理员用户', value: '1' }
            ],
            utypeIndex: 0 // picker 选中的索引
        };
    },
    methods: {
        formSubmit(e) {
            const formdata = e.detail.value;

            // *** 手动将选中的用户类型值添加到 formdata 中 ***
            // userTypes[this.utypeIndex] 获取选中的对象 { label: '...', value: '...' }
            // .value 获取该对象的实际值 ('0' 或 '1')
            formdata.utype = this.userTypes[this.utypeIndex].value;
            // *** 添加结束 ***

            console.log('提交注册表单数据:', formdata);

            // 校验注册信息是否为空
            // 现在 formdata 中已经包含了 utype，所以这里的校验是有效的
            if (!formdata.uname || !formdata.uloginname || !formdata.upassword || typeof formdata.utype === 'undefined' || formdata.utype === null) {
                 // 这里的 typeof formdata.utype === 'undefined' 是为了严谨，但通常手动添加后不会是 undefined
                 // 校验是否为空字符串或 null，如果你的 value 可以是 '0'，不能简单用 !formdata.utype
                 // 可以更精确校验：!formdata.uname || ... || formdata.utype === '' || formdata.utype === null
                 // 或者如果你确定 value 只有 '0' 和 '1' 且不能为空，上面那种校验是 OK 的
                uni.showToast({
                    title: '请填写所有注册信息',
                    icon: 'none'
                });
                return;
            }

            // 调用注册接口
            addUser(formdata).then((res) => {
                console.log('注册结果：', res);

                // 根据后端返回的 code 进行判断
                if (res.code === '200') { // 注意这里我特意用了字符串 '200' 来匹配你的后端返回
                    uni.showToast({
                        title: '注册成功',
                        icon: 'success',
                        duration: 2000,
                        success: () => {
                            // 注册成功后的操作，例如跳转到登录页面
                            uni.navigateTo({
                                url: '/pages/me/login' // 请根据你的实际路径修改
                            });
                        }
                    });

                } else {
                    uni.showToast({
                        title: res.msg || '注册失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }).catch((err) => {
                console.error('注册请求出错：', err);
                uni.showToast({
                    title: '注册请求失败，请稍后再试',
                    icon: 'none',
                    duration: 2000
                });
            });
        },

        formReset() {
            console.log('重置注册表单');
            this.utypeIndex = 0; // 重置用户类型选择为普通用户
            // 如果你的 input 没有 v-model，只有 name 属性，formReset 会自动清空它们
            // 如果你使用了 v-model，需要在 formReset 方法中手动清空对应的 data 属性
            // 例如: this.formData = { uname: '', uloginname: '', upassword: '', utype: '' };
        },
        userTypeChange(e) {
            this.utypeIndex = e.detail.value; // e.detail.value 是选中项的索引
            console.log('选择的用户类型索引:', this.utypeIndex);
            console.log('选择的用户类型值:', this.userTypes[this.utypeIndex].value);
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 30px;
}

.register-form {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
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
  margin-bottom: 25px;
}

.label {
  font-size: 16px;
  color: #00695c;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input {
  border: none;
  border-bottom: 2px solid #80cbc4;
  padding: 12px 0;
  font-size: 16px;
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
  gap: 15px;
  margin-top: 35px;
}

.submit-button {
  flex: 1;
  background-color: #26a69a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #00897b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}

.reset-button {
  flex: 1;
  background-color: transparent;
  color: #26a69a;
  border: 2px solid #26a69a;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #e0f7fa;
    color: #00897b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}
</style>