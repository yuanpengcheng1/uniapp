<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */

  /* 添加自定义字体的 @font-face 规则 */
  @font-face {
    font-family: 'ShareTech'; /* 定义一个字体名称，你将在CSS中使用它 */
    /* 指向字体文件的路径，/static 是 Uni-app 中静态资源的根目录 */
    src: url('/static/fonts/ShareTech-Regular.ttf') format('truetype');
    font-weight: normal; /* 根据字体文件的实际情况设置，Regular 通常是 normal */
    font-style: normal;   /* 根据字体文件的实际情况设置 */
  }

  /*
    你可以在这里为整个应用设置默认字体，
    或者在页面的 <style> 中为特定元素设置。
    为 page, view, text 设置可以影响大多数文本元素。
  */
/* App.vue 的 <style> */
/* ... @font-face 规则 ... */

page, view, text {
   font-family: 'ShareTech', sans-serif;
   /* 添加或修改字体样式 */
   font-size: 30rpx; /* 修改字体大小 */
   /* font-weight: bold; */ /* 尝试加粗（效果取决于字体文件） */
   /* line-height: 1.5; */  /* 修改行高 */
   /* text-align: center; */ /* 居中文本 */
}

/* 你也可以在其他页面的 <style scoped> 中覆盖这些全局样式 */
/* 例如在某个页面的标题样式中单独设置 */
.page-title {
    font-size: 40rpx;

    font-weight: bold; /* 如果 ShareTech 有 bold 变体并已导入 */
}
</style>