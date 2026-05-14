// @ts-ignore
/* eslint-disable */

declare namespace API {
    /** mini登录 */
    type MiniLogin = {
        code: string;
    };

    /** 全局通用分页请求参数 */
    type PageParams<T = any> = {
        page?: number;
        pageSize?: number;
    } & {
            [P in keyof T]?: T[P];
        };

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string;
        /** 业务上的错误信息 */
        errorMessage?: string;
        /** 业务上的请求是否成功 */
        success?: boolean;
    };
}
