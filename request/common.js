const base_url = 'http://localhost:8081';
const timeout = 5000;

export default (param) => {
  let url = param.url;
  let method = param.method || 'get';
  let data = param.data || {};
  let header = {
    "Content-Type": "application/json;charset=utf-8",
    ...param.header
  };

  return new Promise((resolve, reject) => {
    uni.request({
      url: base_url + url,
      method: method,
      header: header,
      data: data,
      timeout,
      success(res) {
        if (res.statusCode === 200) {
          // **在这里检查后端返回的业务状态码**
          if (res.data && res.data.code === '200') {
            resolve(res.data); // 业务成功
          } else {
            // 业务失败，reject 并传递整个 res 对象以便 handleLike 中可以获取错误信息
            reject(res);
          }
        } else {
          // HTTP 状态码错误，reject
          reject(res);
        }
      },
      fail(err) {
        // 网络错误等，reject
        reject(err);
      }
    });
  }).catch((err) => {
    console.error('请求失败:', err);
    // **你可以在这里统一处理请求失败的情况，例如显示全局的错误提示**
    uni.showToast({
      title: (err.data && err.data.msg) || err.errMsg || '请求失败，请稍后重试',
      icon: 'none',
      duration: 2000
    });
    // **重要的是，这里你仍然需要抛出错误，以便调用方（handleLike）也能捕获到**
    throw err;
  });
};