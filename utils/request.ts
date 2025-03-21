// 请求函数
import { ofetch } from 'ofetch';

const baseUrls = {
  development: 'http://127.0.0.1:4396',
  production: 'https://api.linkstarted.top',
} as Record<string, string>;

// 获取当前环境
const currentEnv = process.env.NODE_ENV || 'development';

// 获取对应环境的 API 地址
const apiBaseUrl = baseUrls[currentEnv] || baseUrls.development;

const request = ofetch.create({
  baseURL: apiBaseUrl, // 动态设置基础路径
  retry: 0,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
  async onRequest({ request, options }) {},
  async onRequestError({ request, options, error }) {
    // 请求错误拦截器
    // console.error('请求错误:', error);
  },
  async onResponse({ request, options, response }) {
    // 响应拦截器
    // console.log('响应收到:', response._data);
  },
  async onResponseError({ request, options, response }) {
    // 响应错误拦截器
    // console.error('响应错误:', response?.status, response?._data);
  },
});

export default request;
