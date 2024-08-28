export enum BaseResponseType {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export type BaseResponse = {
  /**
   * The type of the response
   */
  type: BaseResponseType;

  /**
   * The data of the response
   */
  data?: any;

  /**
   * The code of the response
   */
  code?: string;

  /**
   * The message of the response
   */
  message?: string;
};
