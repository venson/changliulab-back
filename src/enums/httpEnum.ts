/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  // SUCCESS = 200,
  SUCCESS = 20000,
  ERROR = 20001,
  TIMEOUT = 10042,
  GATEWAY = 20005,
  TOKEN_ILLEGAL = 50008,
  TOKEN_EXPIRE = 50014,
  UNAUTHORIZED = 50030,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
