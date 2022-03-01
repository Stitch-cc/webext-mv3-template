import axios from 'axios'
import QS from 'qs'

export function useAxios(config, useInterceptors) {
  let service = axios.create(config || {});

  useInterceptors = useInterceptors || false;
  if (useInterceptors) {
    // * request 拦截器
    service.interceptors.request.use(
      config => {
        if (config.method.toUpperCase() === 'POST') {
          config.data = config.data + '&' + QS.stringify({
            _t: Date.parse(new Date()) / 1000
          })
        } else if (config.method.toUpperCase() === 'GET') {
          config.params = {
            ...config.params,
            _t: Date.parse(new Date()) / 1000
          };
        }

        return config;
      },
      error => {
        return Promise.reject(error);
      }
    )

    // * response 拦截器
    service.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * Get 请求封装
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {object} extraParams 请求配置
   */
  function $get(url, params, extraParams) {
    return new Promise((resolve, reject) => {
      service.get(url, { params, ...extraParams })
        .then(res => {
          if (res.status >= 200 && res.status <= 300 || res.status === 302) {
            resolve(res.data)
          } else {
            reject(res)
          }
        })
        .catch(err => reject(err))
    })
  }

  /**
   * POST 请求封装
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {object} config 请求配置
   */
  function $post(url, params, config) {
    return new Promise((resolve, reject) => {
      service.post(url, QS.stringify(params), config)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  return {
    service,
    $get,
    $post
  };
}

export default useAxios;