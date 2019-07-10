/* eslint-disable */
import axios from 'axios';
import {sleep} from './utils';

const BACKOFF_BASE = 2000;
const axiosInstance = axios.create({
  baseURL: 'https://api.tvmaze.com/',
  timeout: 5000,
});

const Api = Object.create(axiosInstance);

/*
  Kinda ratelimit friendly API wrapper.
  Does not keep a global ratelimit timer and queue requests if ratelimits gets reached,
  but instead puts eat request on its own "retry timer thing". Decided that building an
  API call queue was out of scope for this trial assignment and moved on to more fruitful work.

  I doubt concurrent requests to the API will be made anyway. But it'd be something I would
  put down the effort in doing in case of actual code that was being written for a client.
*/

const methodExtensions = {
  async wrapRequest(method, ...args) {
    let attempt = 0;
    while(true) {
      try {
        // Yeah, this is an ugly hack, but it makes rest of code more elegant.
        return await Reflect.getPrototypeOf(this)[method].call(this,...args);
      } catch (err) {
        if(!err.isAxiosError) throw err;
        if(!err.response) throw err;
        if(err.response.status !== 429) throw err;

        // If we get rate limited, retry after longer and longer backoff times. At a max of 10 times the base backoff.
        const backoff = Math.min(BACKOFF_BASE * 10, Math.round(BACKOFF_BASE * Math.pow(1.5, attempt)));
        attempt++;
        if(this.maxRetries && attempt >= this.maxRetries) throw err;
        console.log(`We got ratelimited, waiting ${backoff}ms. We have tried ${attempt} times.`)
        await sleep(backoff);
      }
    }     
  },
  request (...args) { return this.wrapRequest('request', ...args); },
  get (...args) { return this.wrapRequest('get', ...args); },
  delete (...args) { return this.wrapRequest('delete', ...args); },
  head (...args) { return this.wrapRequest('head', ...args); },
  options (...args) { return this.wrapRequest('options', ...args); },
  post (...args) { return this.wrapRequest('post', ...args); },
  put (...args) { return this.wrapRequest('put', ...args); },
  patch (...args) { return this.wrapRequest('patch', ...args); },
  async getShowsPage(page) {
    page = page || 0;
    if(typeof page !== 'number') {
      throw new  TypeError(`Invalid type, expected number, got ${typeof page}`);
    }
    if(!Number.isInteger(page) || page < 0) {
      throw new RangeError('Invalid value, expected positive integer');
    }
    return await this.get(`shows?page=${page}`);
  },
  async getShowsFromId(lastId, arr) {
    lastId = lastId || 0;
    let page = Math.floor(lastId/250);
    if (!Array.isArray(arr)) arr = [];
    
    while(true) {
      try {
        const res = await this.getShowsPage(page);
        arr.push(...res.data);
        page++;
      } catch (err) {
        if(!err.isAxiosError) throw err;
        if(!err.response) throw err;

        // If we 404, we have gone through all pages and should break out of the loop.
        if(err.response.status === 404) break;
        
        throw err;
      }
    }
    return arr;
  }
};
const exprt = Object.assign(Api, methodExtensions);
window.api = exprt;
export default exprt;
