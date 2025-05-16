<template>
    <view class="comment-page">
        <!-- 文章信息部分 -->
        <view class="article-section">
            <text class="article-title">{{ articleDetail.title }}</text>
            <text class="article-content">{{ articleDetail.content }}</text>
        </view>

        <!-- 评论列表部分 -->
        <view class="comment-section">
            <view class="comment-header-wrapper">
                 <text class="comment-header">共 {{ totalAllComments }} 条评论</text>
            </view>

            <view v-if="isLoading" class="loading-indicator">加载中...</view>
            <view v-else-if="!commentList.length && !totalAllComments" class="empty-state">暂无评论，快来抢沙发吧！</view>
            <template v-else>
                <!-- Loop through parent comments -->
                <view v-for="parentComment in commentList" :key="parentComment.id" class="parent-comment-container">
                    <!-- Parent Comment Item -->
                    <view class="comment-item">
                        <image :src="parentComment.avatar" class="avatar" />
                        <view class="comment-details">
                            <view class="comment-main-content">
                                <view class="user-info-row">
                                    <text class="nickname">{{ parentComment.uname }}</text>
                                    <text v-if="articleDetail.authorId && parentComment.userId === articleDetail.authorId" class="tag author-tag">作者</text>
                                    <text v-if="parentComment.isPinned" class="tag pinned-tag">置顶</text>
                                </view>
                                <text class="content-text">{{ parentComment.content }}</text>
                                <view class="meta-actions-row">
                                    <text class="time-location">
                                        {{ formatCommentTime(parentComment.createTime) }} {{ parentComment.location || '' }}
                                    </text>
                                    <text class="action-item reply-button" @click="replyTo(parentComment)">回复</text>
                                </view>
                            </view>
                        </view>
                        <view class="like-action" @click="handleLike(parentComment)">
                            <text :class="['like-icon', parentComment.liked ? 'liked' : '']">❤️</text>
                            <text class="like-count">{{ parentComment.likeCount > 0 ? parentComment.likeCount : '' }}</text>
                        </view>
                    </view>

                    <!-- Replies Section for this Parent -->
                    <view v-if="parentComment.allReplies && parentComment.allReplies.length > 0" class="replies-container">
                        <!-- Loop through VISIBLE replies -->
                        <view
                            v-for="reply in parentComment.visibleReplies"
                            :key="reply.id"
                            class="comment-item is-reply"
                        >
                            <image :src="reply.avatar" class="avatar reply-avatar" />
                            <view class="comment-details">
                                <view class="comment-main-content">
                                    <view class="user-info-row">
                                        <text class="nickname">{{ reply.uname }}</text>
                                        <text v-if="articleDetail.authorId && reply.userId === articleDetail.authorId" class="tag author-tag">作者</text>
                                    </view>
                                    <text class="content-text">{{ reply.content }}</text>
                                    <view class="meta-actions-row">
                                        <text class="time-location">
                                            {{ formatCommentTime(reply.createTime) }} {{ reply.location || '' }}
                                        </text>
                                        <text class="action-item reply-button" @click="replyTo(reply)">回复</text>
                                    </view>
                                </view>
                            </view>
                            <view class="like-action" @click="handleLike(reply)">
                                <text :class="['like-icon', reply.liked ? 'liked' : '']">❤️</text>
                                <text class="like-count">{{ reply.likeCount > 0 ? reply.likeCount : '' }}</text>
                            </view>
                        </view>

                        <!-- Expand/Collapse Button -->
                        <view
                            v-if="parentComment.allReplies.length > 1 && parentComment.hiddenReplyCount > 0 && !parentComment.isExpanded"
                            class="expand-reply-button"
                            @click="toggleReplies(parentComment)"
                        >
                            展开其余 {{ parentComment.hiddenReplyCount }} 条回复 <text class="arrow-icon">›</text>
                        </view>
                         <view
                            v-if="parentComment.isExpanded && parentComment.allReplies.length > 1"
                            class="expand-reply-button"
                            @click="toggleReplies(parentComment)"
                        >
                            收起回复 <text class="arrow-icon active">›</text>
                        </view>
                    </view>
                </view>
                <view v-if="totalAllComments > 0 && !isLoading" class="list-end-tip">- 到底了 -</view>
            </template>
        </view>

        <!-- 底部输入框区域 -->
        <view class="input-box-placeholder"></view>
        <view class="input-box">
            <input
                class="input"
                v-model="newCommentText"
                :placeholder="replyingTo ? '回复 ' + replyingTo.uname : '善语结善缘，恶言伤人心~'"
                confirm-type="send"
                @confirm="submitComment"
                @blur="handleInputBlur"
                :adjust-position="true"
                :cursor-spacing="10"
            />
            <button v-if="newCommentText.trim().length > 0" class="submit-btn" size="mini" @click="submitComment" :disabled="isSubmitting">发送</button>
        </view>
    </view>
</template>

<script>
import { getCommentList ,getCommentsByEventIdWithUser, addComment, likeComment } from '../../request/Api.js'; // Verify this path

export default {
    data() {
        return {
            articleDetail: {
                id: null,
                title: '',
                content: '',
                authorId: null,
            },
            commentList: [], // Stores parent comments, each with .allReplies and .visibleReplies
            newCommentText: '',
            replyingTo: null,
            totalAllComments: 0, // Total count of all comments (parents + all replies) for header
            userId: null,
            loginPagePath: '/pages/me/login',
            isLoading: true,
            isSubmitting: false,
        };
    },
    methods: {
async fetchComments() {
    if (!this.articleDetail.id) {
        this.isLoading = false;
        return;
    }
    this.isLoading = true;
    try {
        const res = await getCommentList(this.articleDetail.id); // 使用 getCommentList 方法
        if (res.statusCode === 200 && res.data.code === "200") {
            const rawComments = res.data.data || [];

            // 初始化展开/收起状态和可见回复
            rawComments.forEach(parent => {
                parent.allReplies = parent.replies || []; // 使用后端返回的 replies
                parent.visibleReplies = parent.allReplies.length > 0 ? [parent.allReplies[0]] : [];
                parent.isExpanded = false;
                parent.hiddenReplyCount = parent.allReplies.length - parent.visibleReplies.length;
                parent.isParent = true; // 标记为父级评论
                if (parent.replies && parent.replies.length > 0) {
                    parent.replies.forEach(reply => {
                        reply.isReply = true; // 标记为子评论
                    });
                }
            });

            this.commentList = rawComments;
            this.totalAllComments = rawComments.length + rawComments.reduce((sum, parent) => sum + (parent.replies ? parent.replies.length : 0), 0);

        } else {
            this.commentList = [];
            this.totalAllComments = 0;
            uni.showToast({ title: res.data?.msg || '获取评论失败', icon: 'none' });
        }
    } catch (err) {
        console.error("获取评论异常：", err);
        const errorMsg = err?.data?.msg || err?.errMsg || '获取评论失败，请稍后重试';
        uni.showToast({ title: errorMsg, icon: 'none' });
        this.commentList = [];
        this.totalAllComments = 0;
    } finally {
        this.isLoading = false;
    }
},

        toggleReplies(parentComment) {
            parentComment.isExpanded = !parentComment.isExpanded;
            if (parentComment.isExpanded) {
                parentComment.visibleReplies = [...parentComment.allReplies];
            } else {
                parentComment.visibleReplies = parentComment.allReplies.length > 0 ? [parentComment.allReplies[0]] : [];
            }
            parentComment.hiddenReplyCount = parentComment.allReplies.length - parentComment.visibleReplies.length;
            // Vue 2 should generally update, but if not, use this.$forceUpdate() or this.$set for specific parent.
        },

      async handleLike(commentToLike) {
    // 1. 初始日志，查看传入的 commentToLike 对象结构
    console.log("[DEBUG] handleLike - 传入的 commentToLike:", JSON.parse(JSON.stringify(commentToLike)));

    // 2. 严格检查 commentToLike.id 的有效性
    if (commentToLike === null || typeof commentToLike.id !== 'number' || isNaN(commentToLike.id)) {
        console.error("[ERROR] handleLike - 传入的 commentToLike.id 无效或不是数字:", commentToLike ? commentToLike.id : 'commentToLike is null');
        uni.showToast({ title: "操作失败: 评论数据错误", icon: 'none' });
        return;
    }

    // 3. 检查登录状态和 this.userId
    const isLogin = await this.checkLogin();
    if (!isLogin) {
        // checkLogin 内部应该会提示或导航到登录，所以这里直接返回
        return;
    }
    if (typeof this.userId !== 'number' || this.userId === null || isNaN(this.userId)) {
        console.error("[ERROR] handleLike - this.userId 无效或不是数字:", this.userId);
        // 理论上 checkLogin 应该已经保证了 userId，但多一层防护
        uni.showToast({ title: "操作失败: 用户信息错误", icon: 'none' });
        return;
    }

    let targetCommentInstance = null;
    let parentOfReply = null;

    // 4. 查找目标评论实例
    if (commentToLike.isParent) {
        targetCommentInstance = this.commentList.find(p => p.id === commentToLike.id);
    } else {
        for (const parent of this.commentList) {
            if (parent.allReplies && Array.isArray(parent.allReplies)) {
                targetCommentInstance = parent.allReplies.find(r => r.id === commentToLike.id);
                if (targetCommentInstance) {
                    parentOfReply = parent;
                    break;
                }
            }
        }
    }

    if (!targetCommentInstance) {
        console.error("[ERROR] handleLike - 未在列表中找到与 commentToLike.id 匹配的 targetCommentInstance. commentToLike.id:", commentToLike.id);
        uni.showToast({ title: "操作失败: 未找到评论", icon: 'none' });
        return;
    }

    // 5. 再次确认查找到的 targetCommentInstance.id (理论上应该和 commentToLike.id 一致且有效)
    if (typeof targetCommentInstance.id !== 'number' || targetCommentInstance.id === null || isNaN(targetCommentInstance.id)) {
        console.error("[ERROR] handleLike - 查找到的 targetCommentInstance.id 无效!", targetCommentInstance.id);
        uni.showToast({ title: "操作失败: 目标评论ID无效", icon: 'none' });
        return;
    }

    // --- Optimistic UI Update ---
    const originalLiked = targetCommentInstance.liked;
    const originalLikeCount = targetCommentInstance.likeCount;

    targetCommentInstance.liked = !targetCommentInstance.liked;
    targetCommentInstance.likeCount = targetCommentInstance.liked ? (targetCommentInstance.likeCount + 1) : (Math.max(0, targetCommentInstance.likeCount - 1)); // 确保不为负

    if (parentOfReply) {
        const visibleReplyIndex = parentOfReply.visibleReplies.findIndex(vr => vr.id === targetCommentInstance.id);
        if (visibleReplyIndex > -1) {
             parentOfReply.visibleReplies.splice(visibleReplyIndex, 1, {...targetCommentInstance});
        }
    }
    // --- End Optimistic UI Update ---

    // 6. 准备发送给后端的 payload
    const payload = {
        commentId: targetCommentInstance.id, // 确保这是数字
        userId: this.userId                  // 确保这是数字
    };
    console.log("[DEBUG] handleLike - 最终发送给后端的 payload:", JSON.stringify(payload));


    try {
        const res = await likeComment(payload);

 if (res && res.code === "200") {
     console.log("[DEBUG] handleLike - 点赞API成功返回:", res.data);
     const { liked, likeCount } = res.data || {};
     if (typeof liked !== 'undefined' && typeof likeCount !== 'undefined') {
         targetCommentInstance.liked = liked;
         targetCommentInstance.likeCount = likeCount;
         if (parentOfReply) {
             const visibleReplyIndex = parentOfReply.visibleReplies.findIndex(vr => vr.id === targetCommentInstance.id);
             if (visibleReplyIndex > -1) {
                 parentOfReply.visibleReplies.splice(visibleReplyIndex, 1, { ...targetCommentInstance });
             }
         }
     }
 } else {
     // 失败分支
     console.error("[ERROR] handleLike - 点赞API业务失败:", res);
     // 还原 optimistic update
     targetCommentInstance.liked = originalLiked;
     targetCommentInstance.likeCount = originalLikeCount;
     if (parentOfReply) {
         const visibleReplyIndex = parentOfReply.visibleReplies.findIndex(vr => vr.id === targetCommentInstance.id);
         if (visibleReplyIndex > -1) {
             parentOfReply.visibleReplies.splice(visibleReplyIndex, 1, {
                 ...targetCommentInstance,
                 liked: originalLiked,
                 likeCount: originalLikeCount
             });
         }
     }
     uni.showToast({ title: (res && res.msg) || '点赞失败', icon: 'none' });
 }

    } catch (err) {
        console.error('[ERROR] handleLike - 点赞 API 调用异常 (catch block):', err);
        // Revert optimistic update
        targetCommentInstance.liked = originalLiked;
        targetCommentInstance.likeCount = originalLikeCount;
        if (parentOfReply) {
            const visibleReplyIndex = parentOfReply.visibleReplies.findIndex(vr => vr.id === targetCommentInstance.id);
            if (visibleReplyIndex > -1) {
                 parentOfReply.visibleReplies.splice(visibleReplyIndex, 1, {...targetCommentInstance, liked: originalLiked, likeCount: originalLikeCount});
            }
        }
        // err 对象可能包含 uni.request 返回的错误信息，也可能只是网络错误
        const errMsg = (err && err.data && err.data.msg) || (err && err.errMsg) || '点赞请求异常';
        uni.showToast({ title: errMsg, icon: 'none' });
    }
},

        replyTo(comment) {
            this.replyingTo = comment; // comment can be a parent or a reply object
            this.newCommentText = ``;
            this.$nextTick(() => {
                uni.pageScrollTo({ selector: '.input-box', duration: 100 });
            });
        },

        handleInputBlur() {
             setTimeout(() => {
                 // No action needed here for now, placeholder updates based on `replyingTo`
             }, 100);
        },

        async submitComment() {
            if (this.isSubmitting) return;
            const isLogin = await this.checkLogin();
            if (!isLogin) return;

            const contentToSubmit = this.newCommentText.trim();
            if (!contentToSubmit) {
                return uni.showToast({ title: '评论不能为空', icon: 'none' });
            }
            this.isSubmitting = true;

            let parentIdForSubmission = 0;
            // If replyingTo.isParent is true, it's a top-level comment.
            // If replyingTo.isParent is false, it's a reply. Backend needs to handle if it supports multi-level replies.
            // For simplicity, if backend only supports 1 level of reply, parentId should be rootParentId.
            if (this.replyingTo) {
                 // If backend handles only one level of replies (replies are always direct children of main comment)
                 parentIdForSubmission = this.replyingTo.isParent ? this.replyingTo.id : this.replyingTo.rootParentId;
                // If backend handles true nested replies (reply to a reply becomes its child):
                // parentIdForSubmission = this.replyingTo.id;
            }

            const data = {
                eventId: this.articleDetail.id,
                content: contentToSubmit,
                parentId: parentIdForSubmission,
                userId: this.userId,
            };

            try {
                const res = await addComment(data);
                const code = res.code || res.data?.code;
                const msg = res.msg || res.data?.msg || '评论失败';

                if ((code === "200" || code === 200) && res.data && res.data.data) {
                    this.newCommentText = '';
                    this.replyingTo = null;
                    uni.showToast({ title: '评论成功', icon: 'success' });
                    await this.fetchComments(); // Re-fetch to get the latest state including the new comment
                } else {
                    uni.showToast({ title: msg, icon: 'none' });
                }
            } catch (err) {
                console.error('提交评论异常：', err);
                uni.showToast({ title: err?.data?.msg || err?.errMsg || '提交异常', icon: 'none' });
            } finally {
                this.isSubmitting = false;
            }
        },

        loadArticleFromOptions(options) {
            const { id, title, content, authorId } = options;
            this.articleDetail = {
                id: id ? parseInt(id) : null,
                title: decodeURIComponent(title || ''),
                content: decodeURIComponent(content || ''),
                authorId: authorId ? parseInt(authorId) : null,
            };
             if (!this.articleDetail.id) {
                 console.error("文章ID未提供！");
                 uni.showToast({title: '文章信息缺失', icon: 'none'});
                 setTimeout(() => { uni.navigateBack(); }, 1500);
             }
        },

        async checkLogin() {
            const userInfo = uni.getStorageSync('userInfo');
            if (userInfo && userInfo.uid) {
                this.userId = userInfo.uid;
                return true;
            } else {
                this.userId = null;
                uni.navigateTo({ url: this.loginPagePath });
                return false;
            }
        },
        formatCommentTime(timeStr) { // Copied from previous full code
            if (!timeStr) return '';
            try {
                const date = new Date(timeStr);
                if (isNaN(date.getTime())) {
                    const parts = timeStr.split(' ');
                    if (parts.length === 6) {
                        const reorderedDateStr = `${parts[1]} ${parts[2]} ${parts[5]} ${parts[3]}`;
                        const parsedDate = new Date(reorderedDateStr);
                        if (!isNaN(parsedDate.getTime())) {
                            date.setTime(parsedDate.getTime());
                        } else {
                             return timeStr.substring(5,16);
                        }
                    } else {
                        return timeStr.substring(5,16);
                    }
                }
                const now = new Date();
                const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
                if (diffInSeconds < 5) return '刚刚';
                if (diffInSeconds < 60) return diffInSeconds + '秒前';
                const diffInMinutes = Math.floor(diffInSeconds / 60);
                if (diffInMinutes < 60) return diffInMinutes + '分钟前';
                const diffInHours = Math.floor(diffInMinutes / 60);
                if (diffInHours < 24) return diffInHours + '小时前';
                const diffInDays = Math.floor(diffInHours / 24);
                if (diffInDays < 7) return diffInDays + '天前';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                if (year === now.getFullYear()) {
                    return `${month}-${day}`;
                }
                return `${year}-${month}-${day}`;
            } catch (e) {
                return timeStr ? timeStr.substring(5,16) : '';
            }
        },
    },

    onLoad(options) {
        this.loadArticleFromOptions(options);
        const userInfo = uni.getStorageSync('userInfo');
        this.userId = userInfo?.uid || null;
        if(this.articleDetail.id) {
            this.fetchComments();
        } else {
            this.isLoading = false;
        }
    },

    onShow() {
        const userInfo = uni.getStorageSync('userInfo');
        this.userId = userInfo?.uid || null;
    }
};
</script>

<style scoped>
/* --- Basic Page and Article Styles (Keep from previous) --- */
.comment-page {
    padding: 0 30rpx;
    background-color: #fff;
    padding-bottom: 140rpx;
}
.article-section {
    padding-top: 20rpx;
    margin-bottom: 30rpx;
}
.article-title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
    display: block;
    color: #333;
}
.article-content {
    font-size: 30rpx;
    color: #555;
    line-height: 1.6;
    display: block;
}

/* --- Comment Section Header & States (Keep from previous) --- */
.comment-section {
    margin-bottom: 30rpx;
}
.comment-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    margin-bottom: 10rpx;
}
.comment-header {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
}
.loading-indicator, .empty-state {
    text-align: center;
    color: #999;
    padding: 60rpx 0;
    font-size: 28rpx;
}

/* --- Parent Comment Container --- */
.parent-comment-container {
    /* No specific style needed unless you want separators between full parent+reply blocks */
}
.parent-comment-container:not(:last-child) {
    border-bottom: 1rpx solid #f0f0f0; /* Separator after each parent block if .comment-item border is removed */
}


/* --- General Comment Item Styling (Applied to Parent and Reply) --- */
.comment-item {
    display: flex;
    padding: 30rpx 0;
    /* border-bottom: 1rpx solid #f0f0f0; /* Moved to parent-comment-container for block separation */
}
/* .comment-item:last-child {
    border-bottom: none;
} */


.avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    flex-shrink: 0;
    background-color: #f0f0f0;
}
.comment-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.comment-main-content {
    flex: 1;
}
.user-info-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}
.nickname {
    color: #555B62;
    font-weight: 500;
    font-size: 28rpx;
    margin-right: 10rpx;
    line-height: 1.4;
}
.tag {
    font-size: 20rpx;
    padding: 1rpx 8rpx;
    border-radius: 4rpx;
    margin-left: 8rpx;
    line-height: 1.4;
}
.author-tag { color: #FF7A42; background-color: #FFF1EB; }
.pinned-tag { color: #E62C2C; background-color: #FFF0F0; }
.content-text {
    font-size: 30rpx;
    color: #222222;
    line-height: 1.55;
    margin-bottom: 15rpx;
    display: block;
    word-break: break-word;
}
.meta-actions-row {
    display: flex;
    align-items: center;
    gap: 25rpx;
    font-size: 24rpx;
    color: #A0A0A0;
}
.reply-button { color: #A0A0A0; cursor: pointer; }
.reply-button:active { color: #507CAF; }

.like-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20rpx;
    cursor: pointer;
    min-width: 60rpx;
}
.like-icon {
    font-size: 38rpx;
    color: #A0A0A0;
    line-height: 1;
    margin-bottom: 2rpx;
}
.like-icon.liked { color: #FF4F5A; }
.like-count {
    font-size: 22rpx;
    color: #A0A0A0;
    line-height: 1;
    min-height: 22rpx;
}

/* --- Replies Specific Styling --- */
.replies-container {
    padding-left: calc(64rpx + 20rpx); /* Parent avatar width + its margin-right */
    margin-top: 0; /* Replies start immediately under parent meta */
}

.comment-item.is-reply {
    padding: 20rpx 0; /* Vertical padding for replies */
    /* No horizontal padding here as .replies-container handles indentation */
}
.avatar.reply-avatar {
    width: 50rpx;
    height: 50rpx;
}

.expand-reply-button {
    font-size: 26rpx;
    color: #507CAF;
    padding: 20rpx 0 20rpx 0; /* Adjusted padding to align under reply content */
    cursor: pointer;
    display: flex; /* Use flex to align text and icon */
    align-items: center;
}
.expand-reply-button:active {
    opacity: 0.7;
}
.arrow-icon {
    margin-left: 8rpx;
    font-size: 24rpx; /* Adjust size of arrow */
    display: inline-block;
    transition: transform 0.2s ease-in-out;
}
.arrow-icon.active { /* For "收起回复" arrow */
    transform: rotate(90deg);
}


/* --- List End & Input Box (Keep from previous) --- */
.list-end-tip {
    text-align: center;
    font-size: 24rpx;
    color: #C0C0C0;
    margin: 50rpx 0;
}
.input-box-placeholder { height: 110rpx; }
.input-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 15rpx 25rpx;
    border-top: 1rpx solid #ECECEC;
    padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
    z-index: 100;
}
.input {
    flex: 1;
    background-color: #F7F7F7;
    border-radius: 37.5rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    height: 75rpx;
    line-height: 75rpx;
    color: #333;
    border: none;
    margin-right: 15rpx;
}
.input::placeholder { color: #AAAAAA; }
.submit-btn {
    background-color: #FFD100;
    color: #333;
    border: none;
    border-radius: 32.5rpx;
    padding: 0 30rpx;
    height: 65rpx;
    line-height: 65rpx;
    font-size: 28rpx;
    font-weight: 500;
    margin: 0;
}
.submit-btn::after { border: none; }
.submit-btn[disabled] { background-color: #F0F0F0; color: #B0B0B0; }
</style>