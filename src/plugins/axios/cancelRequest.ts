import axios, { Canceler } from 'axios';
import { RequestConfig } from './types';

export default class CancelRequest {
   requestUrlList?: string[]

   cancelRequestSourceList?: Map<string, Canceler>

   constructor() {
     this.requestUrlList = [];
     this.cancelRequestSourceList = new Map();
   }

   /**
   * 添加请求
   * @param url 请求地址
   * @param config axios配置
   * @returns
   */
   addUrl(url: string, config: RequestConfig): RequestConfig {
     this.requestUrlList?.push(url);
     config.cancelToken = new axios.CancelToken((e) => {
       if (config.isCancelRepeat && this.cancelRequestSourceList?.has(url)) {
         e('取消重复请求');
       } else if (!this.cancelRequestSourceList?.has(url)) {
         this.cancelRequestSourceList?.set(url, e);
       }
     });
     return config;
   }

   /**
 * @description: 删除 requestUrlList 和 cancelRequestSourceList
 * @param {string} url
 * @returns {*}
 */
   delUrl(url: string) {
     const urlIndex = this.requestUrlList?.findIndex((u) => u === url);
     const haveSource = this.cancelRequestSourceList?.has(url);
     // 删除url和cancel方法
     if (urlIndex !== -1) {
       this.requestUrlList?.splice(urlIndex as number, 1);
     }
     if (haveSource) {
       this.cancelRequestSourceList?.delete(url);
     }
   }

   /**
   * 取消单个请求
   * @param url
   */
   cancelOneRequest(url: string) {
     // 取消单个请求
     if (this.cancelRequestSourceList?.has(url)) {
       const cancelToken = this.cancelRequestSourceList.get(url);
       if (cancelToken) {
         cancelToken('取消请求');
       }
     }
   }

   /**
   * 取消多个请求
   * @param url
   */
   cancelRequests(url: string[]) {
     for (let i = 0, l = url.length; i < l; i++) {
       const u = url[i];
       this.cancelOneRequest(u);
     }
   }

   /**
   * 取消所有在取消集合里请求
   */
   cancelAllRequest() {
     const requests = Array.from(this.cancelRequestSourceList?.values() as IterableIterator<Canceler>);
     requests.forEach((c) => {
       if (c) {
         c();
       }
     });
   }
}
