<template>
	<view class="edit-profile-container">
		<view class="navbar">
			<view class="back-button" @click="goBack">
				<uni-icons type="left" size="24" color="#000"></uni-icons>
			</view>
			<view class="title">个人信息</view>
			<view class="right-icons"></view>
		</view>

		<view class="profile-list">
			<view class="profile-item" @click="chooseAvatar">
				<text class="label">头像</text>
				<view class="profile-value">
					<image class="avatar" :src="avatarUrl" mode="aspectFill" />
					<uni-icons type="right" size="16" color="#888"></uni-icons>
				</view>
			</view>
			<view class="divider"></view>
			<view class="profile-item" @click="changeNickname">
				<text class="label">昵称</text>
				<view class="profile-value">
					<text class="value-text">{{ nickname || '未设置' }}</text>
					<uni-icons type="right" size="16" color="#888"></uni-icons>
				</view>
			</view>
			<view class="divider"></view>
			<view class="profile-item" @click="navigateToChangePassword">
				<text class="label">修改密码</text>
				<view class="profile-value">
					<text class="value-text">******</text>
					<uni-icons type="right" size="16" color="#888"></uni-icons>
				</view>
			</view>
			<view class="divider"></view>
			<view class="profile-item logout-account" @click="confirmDeleteAccount">
				<text class="label logout-label">注销账号</text>
			</view>
		</view>

		<button class="save-button" @click="saveProfile">保存</button>
	</view>
</template>

<script>
	import {
		updateUser,
		deleteUser,
		uploadAvatar
	} from '../../request/Api.js';

	export default {
		data() {
			return {
				avatarUrl: '/static/images/user/icons-login.png',
				nickname: '',
				tempAvatarPath: '',
				userInfo: {}
			};
		},
		onLoad() {
			this.loadProfile();
		},
		methods: {
			loadProfile() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo && userInfo.uid) {
					this.userInfo = userInfo;
					this.nickname = userInfo.username;
					this.avatarUrl = userInfo.avatar || '/static/images/user/icons-login.png';
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/me/login'
						});
					}, 1500);
				}
			},
			goBack() {
				uni.navigateBack();
			},
			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (chooseImageRes) => {
						const tempFilePath = chooseImageRes.tempFilePaths[0];
						this.avatarUrl = tempFilePath; // 预览选择的头像
						this.tempAvatarPath = tempFilePath;
					},
					fail: (err) => {
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						});
					}
				});
			},
			changeNickname() {
				uni.showModal({
					title: '修改昵称',
					editable: true,
					placeholderText: '请输入新昵称',
					content: this.nickname,
					success: (res) => {
						if (res.confirm) {
							const newNickname = res.content ? res.content.trim() : '';
							this.nickname = newNickname;
						}
					}
				});
			},
			navigateToChangePassword() {
				if (!this.userInfo || !this.userInfo.uid) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/me/change-password'
				});
			},
			confirmDeleteAccount() {
				uni.showModal({
					title: '警告',
					content: '一旦注销，您的账号数据将彻底清除，且无法恢复。您确定要注销账号吗？',
					confirmText: '确认注销',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.deleteAccount();
						}
					}
				});
			},
			async deleteAccount() {
				if (!this.userInfo || !this.userInfo.uid) {
					uni.showToast({
						title: '用户信息异常，无法注销',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '注销中...'
				});

				try {
					const res = await deleteUser({
						uid: this.userInfo.uid
					});
					uni.hideLoading();

					if (res && res.statusCode === 200) {
						uni.showToast({
							title: res.data.msg || '账号已注销',
							icon: 'success'
						});
						uni.removeStorageSync('userInfo');
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/me/login'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.msg || '注销失败',
							icon: 'none'
						});
					}
				} catch (err) {
					uni.hideLoading();
					uni.showToast({
						title: '注销失败，请稍后再试',
						icon: 'none'
					});
				}
			},
			async saveProfile() {
				if (!this.userInfo || !this.userInfo.uid) {
					uni.showToast({
						title: '用户信息未加载，无法保存',
						icon: 'none'
					});
					return;
				}
			
				uni.showLoading({
					title: '保存中...'
				});
			
				let avatarToSave = this.avatarUrl;
			
				if (this.tempAvatarPath) {
					try {
						const uploadRes = await uploadAvatar(this.tempAvatarPath, this.userInfo.uid);
						console.log('uploadRes:', uploadRes);
			
						// ✅ 修正：不判断 statusCode，因为 uploadAvatar 返回的是 JSON 对象
						if (uploadRes && uploadRes.code === '200') {
							// 如果需要完整路径，则加上 base_url，如：avatarToSave = base_url + uploadRes.data;
							avatarToSave = uploadRes.data;
						} else {
							uni.showToast({
								title: uploadRes.msg || '头像上传失败',
								icon: 'none'
							});
							uni.hideLoading();
							return;
						}
					} catch (err) {
						console.error('上传出错：', err);
						uni.hideLoading();
						uni.showToast({
							title: '头像上传失败，请稍后再试',
							icon: 'none'
						});
						return;
					}
				}
			
				const updateData = {
					uid: this.userInfo.uid,
					uname: this.nickname,
					avatar: avatarToSave
				};
			
				try {
					const res = await updateUser(updateData);
					uni.hideLoading();

					if (res && res.code === '200' && res.data === 1) {
						uni.showToast({
							title: res.msg || '保存成功',
							icon: 'success'
						});

						// 更新本地存储的用户信息
						const latestUserInfo = uni.getStorageSync('userInfo') || {};
						latestUserInfo.username = this.nickname;
						latestUserInfo.avatar = avatarToSave;
						uni.setStorageSync('userInfo', latestUserInfo);

						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: res.msg || '保存失败',
							icon: 'none'
						});
					}
				} catch (err) {
					uni.hideLoading();
					console.error('保存出错：', err);
					uni.showToast({
						title: '保存失败，请稍后再试',
						icon: 'none'
					});
				}
			}
}
	};
</script>


<style lang="scss" scoped>
	$navbar-height: 44px;
	$status-bar-height: var(--status-bar-height);

	.edit-profile-container {
		background-color: #f7f7f7;
		min-height: 100vh;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.navbar {
		display: flex;
		align-items: center;
		height: $navbar-height;
		background-color: #fff;
		position: sticky;
		top: 0;
		padding: 0 10px;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
		z-index: 10;
	}

	.back-button {
		width: 40px;
		height: $navbar-height;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 18px;
		font-weight: bold;
		color: #333;
		z-index: 1;
	}

	.right-icons {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		z-index: 2;
	}

	.profile-list {
		margin-top: 10px;
		background-color: #fff;
		overflow: hidden;
	}

	.profile-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		padding: 15px 20px;
		border-bottom: 1px solid #eee;
		font-size: 16px;
		color: #333;
		cursor: pointer;
	}

	.profile-item:last-child {
		border-bottom: none;
	}

	.label {
		flex: 1;
	}

	.profile-value {
		display: flex;
		align-items: center;
		color: #666;
		font-size: 16px;
		max-width: 70%;
	}

	.value-text {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 5px;
		text-align: right;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 5px;
		background-color: #eee;
	}

	.divider {
		height: 1px;
		background-color: #eee;
	}

	.logout-account {
		color: #ff0000;
		font-weight: bold;
		justify-content: center;
	}

	.logout-label {
		text-align: center;
		flex: none;
	}

	.save-button {
		background-color: #8fdf82;
		color: #fff;
		margin: 30px 20px;
		height: 45px;
		line-height: 45px;
		font-size: 18px;
		border-radius: 22.5px;
		text-align: center;
		width: auto;
	}
</style>