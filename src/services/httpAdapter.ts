import { RawAxiosRequestConfig } from "axios";
import { axiosInit } from "../config";

class HttpAdapter extends axiosInit {
  public get(url: string, config: RawAxiosRequestConfig = {}) {
    const axiosConfig = { ...config, params: { ...config.params } };

    return this.axios().get(url, axiosConfig);
  }

  public post(url: string, data?: any, config?: RawAxiosRequestConfig) {
    const postData = { ...data };

    return this.axios().post(url, postData, config);
  }
}

export default HttpAdapter;
