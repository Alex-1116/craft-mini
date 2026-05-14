type RequestOptions = {
  url: string;
  data?: any;
  token?: boolean;
  method?: RequestEnum;
};

type ResponseData = {
  data?: any;
  errMsg?: string;
  statusCode?: number;
};

// resolve返回的promise数据类型
type DataType = {
  data?: any;
  msg?: string;
  message?: string;
  code?: number;
}

// interceptor模块返回的https函数类型如下
type HttpInterceptor = <T>(options: {
  url: string;
  data?: any;
  token?: boolean;
  method: RequestEnum;
}) => Promise<T>;