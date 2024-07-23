import axios from "axios";

// Add a new property to AxiosRequestConfig interface
declare module "axios" {
  export interface AxiosRequestConfig {
    authorization?: boolean;
  }
}

let failedQueue: any = [];
let isRefreshing = false;

const processQueue = (error: any) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

interface TokenTypes {
  options: any;
  getCurrentAccessToken: any;
  getCurrentRefreshToken: any;
  refreshTokenUrl: any;
  logout: any;
  setRefreshedTokens: any;
}

export const createAxiosClient = ({
  options,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}: TokenTypes) => {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken();
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      //Any status code within 2xx range fires this function
      return response;
    },
    (error) => {
      const originalRequest = error.config;

      //workaround for axios ^1.1.3 due to issue with headers
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );

      const refreshToken = getCurrentRefreshToken();

      // If error, process all the requests in the queue and logout the user
      const handleError = (error: any) => {
        processQueue(error);
        logout();
        return Promise.reject(error);
      };

      // Refresh token conditions
      if (
        refreshToken &&
        error.response?.status === 401 &&
        error.response.data.message === "TokenExpiredError" &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        originalRequest._retry = true;
        return client
          .post(refreshTokenUrl, {
            refreshToken: refreshToken,
          })
          .then((res) => {
            const tokens = {
              accessToken: res.data?.accessToken,
              refreshToken: res.data?.refreshToken,
            };
            setRefreshedTokens(tokens);
            processQueue(null);

            return client(originalRequest);
          }, handleError)
          .finally(() => {
            isRefreshing = false;
          });
      }

      // Refresh token missing or expired => logout user.
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "TokenExpiredError"
      ) {
        return handleError(error);
      }

      // Status codes that fall outside 2xx range fire this function
      return Promise.reject(error);
    }
  );

  return client;
};
