import Request from './request';
import type { RequestConfig, RequestInterceptors } from '@/plugins/axios/types';

const request = new Request({
  baseURL: import.meta.env.BASE_URL,
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      console.log('实例请求拦截器');
      return config;
    },
    // 响应拦截器
    responseInterceptors: (result) => {
      console.log('实例响应拦截器');
      return result;
    },
  },
});

interface ApiRequestConfig<T> extends RequestConfig {
  data?: T
}

interface ApiResponse<T> {
  code: number
  msg: string
  info: T
}

/**
 * 不带重复请求自动取消的
 * @param config { url: '', data: {}, ... }
 * @returns
 */
export const get = <D, T = any>(config: ApiRequestConfig<D>) => {
  const { method = 'GET' } = config;
  if (method === 'get' || method === 'GET') {
    config.params = config.data;
  }
  return request.request<ApiResponse<T>>(config);
};

/**
* 带重复请求自动取消的
* @param url 接口地址
* @param data 接口传参
* @param interceptors 单个接口拦截器
* @returns
*/
export const $get = <D, T = any>(url: string, data?: D, interceptors?: RequestInterceptors) => {
  const method = 'GET';
  return request.request<ApiResponse<T>>({
    url,
    method,
    params: data,
    interceptors,
    isCancelRepeat: true,
  });
};

/**
 * 不带重复请求自动取消的
 * @param config  { url: '', data: {}, ... }
 * @returns
 */
export const post = <D, T = any>(config: ApiRequestConfig<D>) => {
  const { method = 'POST' } = config;
  return request.request<ApiResponse<T>>({ ...config, method });
};

/**
 * 带重复请求自动取消的
 * @param url 接口地址
 * @param data 接口传参
 * @param interceptors 单个接口拦截器
 * @returns
 */
export const $post = <D, T = any>(url: string, data?: D, interceptors?: RequestInterceptors) => {
  const method = 'POST';
  return request.request<ApiResponse<T>>({
    url, data, method, interceptors, isCancelRepeat: true,
  });
};

export default request;
