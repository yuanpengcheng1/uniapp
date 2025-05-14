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
          resolve(res.data);
        } else {
          reject(res); 
        }
      },
      fail(err) {
        reject(err);
      }
    });
  }).catch((err) => {
    console.error('请求失败:', err);
  });
};
