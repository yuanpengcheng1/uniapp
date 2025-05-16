	<template>
	  <view class="list-container">
		<view
		  class="list-item"
		  v-for="(item, index) in listData"
		  :key="index"
		  @click="goToCommentPage(item)"
		>
		  <image :src="item.imgUrl" class="item-image" mode="aspectFill"></image>
		  <view class="item-content">
			<text class="item-title">{{ item.title }}</text>
			<text class="item-subtitle">{{ item.subtitle }}</text>
		  </view>
		</view>
	  </view>
	</template>

	<script>
	import { listByType } from '../../request/Api.js';

	export default {
	  components: {
	  },
	  data() {
		return {
		  listData: [],
		  selectedType: 'lecture',
		};
	  },
	  methods: {
		fetchHistoryEvents() {
		  listByType(this.selectedType)
			.then((res) => {
			  if (
				res &&
				res.statusCode === 200 &&
				res.data &&
				res.data.code == 200
			  ) {
				let result = res.data.data;

				if (result && Array.isArray(result) && result.length > 0) {
				  result.sort((a, b) => {
					let aTime = a.updateTime;
					let bTime = b.updateTime;

					if (aTime && bTime) {
					  if (!(aTime instanceof Date)) {
						aTime = new Date(aTime);
					  }
					  if (!(bTime instanceof Date)) {
						bTime = new Date(bTime);
					  }
					  if (!isNaN(aTime.getTime()) && !isNaN(bTime.getTime()))
						return bTime.getTime() - aTime.getTime();
					  else return 0;
					} else if (aTime) {
					  return -1;
					} else if (bTime) {
					  return 1;
					} else {
					  return 0;
					}
				  });

				  this.listData = result.map((item) => ({
					id: item.id,
					imgUrl: item.imgUrl,
					title: item.title,
					subtitle: item.eventDate,
					content: item.content, // 传递文章内容
					// 其他你需要的字段
				  }));

				  uni.setStorageSync('cultureTopics', this.listData);

				  uni.showToast({
					title: '讲堂信息加载成功',
					icon: 'success',
				  });
				} else {
				  console.warn(
					'业务码 200，但无匹配讲堂数据或数据格式不正确',
					res.data
				  );
				  this.listData = [];
				  uni.setStorageSync('cultureTopics', []);
				  uni.showToast({
					title: '未找到相关讲堂信息',
					icon: 'none',
				  });
				}
			  } else {
				console.warn('接口返回业务错误或状态码非200:', res.data);
				this.listData = [];
				uni.setStorageSync('cultureTopics', []);
				uni.showToast({
				  title:
					res.data && res.data.msg
					  ? res.data.msg
					  : '加载讲堂信息失败',
				  icon: 'none',
				});
			  }
			})
			.catch((err) => {
			  console.error('请求出错:', err);
			  this.listData = [];
			  uni.setStorageSync('cultureTopics', []);
			  uni.showToast({
				title: '网络错误，无法加载讲堂信息',
				icon: 'none',
			  });
			});
		},
		goToCommentPage(item) {
		  uni.navigateTo({
			url: `/pages/list/comment?id=${item.id}&title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}`,
			success: () => {
			  console.log('跳转到 comment 页面成功', item);
			},
			fail: (error) => {
			  console.error('跳转到 comment 页面失败', error);
			},
		  });
		},
	  },
	  onLoad() {
		this.fetchHistoryEvents();
	  },
	};
	</script>

	<style scoped>
	.list-container {
	  padding: 10px;
	}
	.list-item {
	  display: flex;
	  flex-direction: row;
	  margin-bottom: 15px;
	  background-color: #fff;
	  border-radius: 8px;
	  overflow: hidden;
	  box-shadow: 0 0 5px #ddd;
	  cursor: pointer;
	}
	.item-image {
	  width: 120px;
	  height: 90px;
	  border-radius: 8px 0 0 8px;
	  margin-right: 10px;
	}
	.item-content {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  justify-content: space-between;
	  padding: 10px 0;
	}
	.item-title {
	  font-size: 16px;
	  font-weight: bold;
	  color: #333;
	  line-height: 1.4;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	.item-subtitle {
	  font-size: 13px;
	  color: #666;
	  line-height: 1.2;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	</style>
