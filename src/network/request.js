import axios from 'axios';
import qs from 'qs'

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Boolean} json [true：json格式请求头；false：FormData格式请求头]
 */
export function post(url, params = {}, json = false) {
  // json格式请求头
  const headerJSON = {
    "Content-Type": "application/json"
  };
  // FormData格式请求头
  const headerFormData = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, json ? JSON.stringify(params) : QS.stringify(params), {
        headers: json ? headerJSON : headerFormData
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function postHeader(params, isJson) {
  return post('/api/123', params, isJson)
}

export function request(url, params, method, type, header) {
    const instance = axios.create({
        baseURL: '/api',
        timeout: 100000,
        // withCredentials: true,
    })

    // axios拦截器
    instance.interceptors.request.use(config => {
        return config
    })

    if (method && method == 'post') {
        if (type && type == "params") {
            if (params) {
                // return instance.post(url, params)
                if (header == 'json') {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                    })
                } else if (type == 'paramsSerializer') {
                    return instance.request({
                        url,
                        data: qs.stringify(params, {arrayFormat: 'repeat'}),
                        method: 'post',
                    })
                } else {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                    })
                }
            } else {
                return instance.post(url)
            }
        } else {
            // resful的形式
            if (params) {
                for (var key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.post(url);
        }
    } else if (!method || method == 'get') {
        if (type == 'resful' || !type) {
            // resful的形式
            if (params) {
                for (var key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.get(url);
        } else if (type == 'params') {
            console.log(params);
            params = {
                params: params
            }
            return instance.get(url, params)
        }
    } else if (method && method == 'put') {
        if (params) {
            return instance.put(url, params)
        } else {
            return instance.put(url)
        }
    } else if (method && method == 'delete') {
        // resful的形式
        if (params) {
            for (var key in params) {
                // 拼接url
                url = url + '/' + params[key];
            }
        }
        return instance.delete(url);
    }
}
