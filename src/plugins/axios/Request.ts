import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestConfig, RequestInterceptors } from './types';
import CancelRequest from './cancelRequest';

class Request {
  // axios 实例
  instance: AxiosInstance

  // 拦截器对象
  interceptorsObj?: RequestInterceptors

  CancelRequest: CancelRequest

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptorsObj = config.interceptors;
    this.CancelRequest = new CancelRequest();
    this.interceptors();
  }

  /**
   * 初始化拦截器
   * 拦截器的执行顺序为实例请求→类请求→实例响应→类响应
   */
  private interceptors() {
    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (res: AxiosRequestConfig) => {
        // 全局请求拦截器
        console.log();
        return res;
      },
      (err: any) => err,
    );
    this.instanceInterceptors();
    // 全局响应拦截器保证最后运行
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 全局响应拦截
        console.log();
        return res.data;
      },
      (err: any) => err,
    );
  }

  /**
   * 实例拦截器
   */
  private instanceInterceptors() {
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch,
    );

    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch,
    );
  }

  request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果我们给单个接口设置拦截器，在这里进行处理
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }
      const { url } = config;
      if (url) {
        // url存在保存取消请求方法和当前请求url
        this.CancelRequest.addUrl(url, config);
        // console.log(this.CancelRequest);
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单个接口的响应拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res);
          }
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        })
        .finally(() => {
          if (url) {
            this.CancelRequest.delUrl(url);
          }
        });
    });
  }

  /**
   * 取消单个请求
   * @param url
   */
  cancelOneRequest(url: string | string[]) {
    if (typeof url === 'string') {
      this.CancelRequest.cancelOneRequest(url);
    } else {
      this.CancelRequest.cancelRequests(url);
    }
  }

  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    this.CancelRequest.cancelAllRequest();
  }

  getRequestList() {
    return this.CancelRequest.requestUrlList;
  }
}

export default Request;
