import axios, { AxiosInstance } from "axios";

class AxiosInit {
  private instance: AxiosInstance;

  constructor() {
    const init = axios.create({
      baseURL: "http://192.168.5.139:59629/api",
      headers: {
        Accept: "application/json",
      },
    });

    // intercept api response
    init.interceptors.response.use(
      (success) => {
        return success;
      },
      (err) => {
        // Use api message if exists.
        const error = { ...err };
        if (error?.response?.data?.message) {
          error.message = error.response.data.message;
        }

        return Promise.reject(error);
      }
    );

    this.instance = init;
  }

  public axios() {
    return this.instance;
  }
}

export default AxiosInit;
