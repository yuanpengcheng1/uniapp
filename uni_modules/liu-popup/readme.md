### liu-popuo适用于uni-app项目的弹出层组件
### 本组件目前兼容微信小程序、H5
### 本组件支持自定义，支持设置背景色，动画，圆角，自定义宽高，弹出方向
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式
``` html
<template>
	<view>
		<view class="box">
			<view @click="openPopup('top')" class="btn">上面打开弹窗</view>
			<view @click="openPopup('bottom')" class="btn">下面打开弹窗</view>
			<view @click="openPopup('left')" class="btn">左面打开弹窗</view>
			<view @click="openPopup('right')" class="btn">右面打开弹窗</view>
			<view @click="openPopup('center')" class="btn">中间打开弹窗</view>
		</view>
		<liu-popup type="top" ref="top" radius="12rpx">
			上面打开弹窗
		</liu-popup>
		<liu-popup type="bottom" ref="bottom">
			下面打开弹窗
		</liu-popup>
		<liu-popup type="left" ref="left">
			左面打开弹窗
		</liu-popup>
		<liu-popup type="right" ref="right">
			右面打开弹窗
		</liu-popup>
		<liu-popup type="center" ref="center">
			中间打开弹窗
		</liu-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		methods: {
			openPopup(e) {
				this.$refs[e].open();
			},
		},
	};
</script>
<style lang="scss">
	.box {
		padding: 32rpx;
	}

	.btn {
		width: 686rpx;
		height: 88rpx;
		background: #2182fe;
		border-radius: 8rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #ffffff;
		margin-top: 20rpx;
	}
</style>
```

### 属性说明
| 名称                         | 类型            | 默认值                  | 描述            |
| ----------------------------|---------------- | ---------------------- | ---------------|
| animation                   | Boolean         | true                   | 是否开启动画
| isMask                      | Boolean         | true                   | 是否点击阴影关闭
| safeArea                    | Boolean         | true                   | 是否开启安全条
| radius                      | Number          | 0rpx                   | 圆角
| type                        | String          | bottom                 | 弹出方向
| width                       | String          | auto                   | (非必填，不写自动获取默认插槽宽度)宽，请写上单位50rpx 50vw 50% 50px等(左右中生效)
| height                      | String          | auto                   | (非必填，不写自动获取默认插槽高度)高，请写上单位50rpx 50vh 50% 50px等(上下中生效)
| bgColor                     | String          | #FFFFFF                | 背景色，透明色可以使用none
| isBar                       | Boolean         | false                  | 是否自定义导航栏
| top                         | String          | 导航栏的高度（自动获取）   | 距离顶部的边距（由于每个人写的自定义导航不同，您也自定义值）
| @open                       | Function        |                        | 打开弹层的回调事件
| @close                      | Function        |                        | 关闭回层的回调事件







