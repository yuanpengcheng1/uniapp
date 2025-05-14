import request from './common.js';
const base_url = 'http://localhost:8081'; 
export const loginByName = (param) => {
  console.log("登录请求参数:", param);  // 打印请求参数
  return request({
    url: '/user/getAdminByName',
    method: 'POST',
    data: param,  // 确保传递的数据是正确的格式
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
};

export const addUser = (param) => {
  console.log("注册请求参数:", param); 
  return request({
      url: '/user/addUser', 
      method: 'POST',
      data: param, 
      header: {
          "Content-Type": "application/json;charset=utf-8",
      },
  });
};

export const updateUser = (param) => {
  console.log("更新用户信息请求参数:", param);
  return request({
    url: '/user/updateUser',
    method: 'PUT', 
    data: param, 
    headers: {
      "Content-Type": "application/json;charset=utf-8", 
    },
  });
};
export function deleteUser(params) {
    return uni.request({
        url: base_url + '/user/deleteUser?uid=' + params.uid, // 保持与后端接口路径一致
        method: 'DELETE',
        header: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });
}
export function uploadAvatar(filePath, uid) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: base_url + '/user/uploadAvatar',
            filePath: filePath, // 文件本地路径
            name: 'file', // 与后端参数名一致
            formData: {
                uid: uid  // 👈 确保 uid 是数字
            },
            success: (res) => {
                resolve(JSON.parse(res.data));
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}


