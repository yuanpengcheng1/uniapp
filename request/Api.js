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

export function listByType(type) {
    return uni.request({
        url: base_url + '/history/listByType',
        method: 'GET',
        data: {
            type: type
        },
        header: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });
}

/**
 * 根据事件ID获取评论列表
 * @param {number} eventId - 事件ID
 * @returns {Promise}
 */
export function getCommentsByEventId(eventId) {
  return uni.request({
    url: base_url + '/comment/listByEvent', // 对应后端的 /comment/listByEvent 接口
    method: 'GET',
    data: {
      eventId: eventId, // 将 eventId 放在 data 中
    },
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}

/**
 * 添加评论
 * @param {object} comment - 评论对象，包含 eventId, content, parentId 等
 * @returns {Promise}
 */
export function addComment(comment) {
  return request({ // 使用封装后的 request
    url: '/comment/add', // 对应后端的 /comment/add 接口
    method: 'POST',
    data: comment,
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}

/**
 * 点赞评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function likeComment(data) {
  return request({
    url: '/comment/like',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  });
}

/**
 * 删除评论
 * @param {number} id - 评论ID
 * @returns {Promise}
 */
export function deleteComment(id) {
  return uni.request({
    url: base_url + '/comment/delete?id=' + id, 
    method: 'DELETE',
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}
/**
 * 获取带有用户昵称的评论列表
 * @param {number} eventId - 事件ID
 * @returns {Promise}
 */
export function getCommentsWithUser(eventId) {
  return uni.request({
    url: base_url + '/comment/listWithUser',
    method: 'GET',
    data: {
      eventId: eventId,
    },
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}
/**
  * 获取评论列表
  * @param {number} eventId -  事件ID
  * @returns {Promise}
  */
export function getCommentList(eventId) {
  return uni.request({
    url: base_url + '/comment/list',
    method: 'GET',
    data: {
      eventId,
    },
    header: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
}
/**
 * 获取带有用户昵称的评论列表（用于楼中楼）
 * @param {number} eventId - 事件ID
 * @returns {Promise}
 */
// 仅传 eventId，不传对象
export function getCommentsByEventIdWithUser(eventId) {
  return uni.request({
    url: base_url + '/comment/listWithUser',  // 👈 确保和后端一致
    method: 'GET',
    data: {
      eventId: eventId,  // 👈 只传 eventId
    },
    header: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}
