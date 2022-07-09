import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestInterceptors {
  // 请求拦截器
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (err: any) => any
  // 响应拦截器
  responseInterceptors?: <T = AxiosResponse>(config: T) => T
  responseInterceptorsCatch?: (err: any) => any
}

// 自定义传入参数
export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors
  isCancelRepeat?: boolean
}
