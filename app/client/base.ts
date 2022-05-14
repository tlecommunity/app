import server from 'app/server';
import {
  BodyGetStatusParams,
  BodyGetStatusResponse,
  CaptchaFetchParams,
  CaptchaFetchResponse,
  CaptchaSolveParams,
  CaptchaSolveResponse,
  EmpireGetStatusParams,
  EmpireGetStatusResponse,
  EmpireFetchCaptchaParams,
  EmpireFetchCaptchaResponse,
  EmpireLoginParams,
  EmpireLoginResponse,
  EmpireLogoutParams,
  EmpireLogoutResponse,
  EssentiaVeinDrainParams,
  EssentiaVeinDrainResponse,
  EmpireCreateParams,
  EmpireCreateResponse,
} from 'app/interfaces';

class ClientBase {
  call(
    module: 'body',
    method: 'get_status',
    params: BodyGetStatusParams,
    addSession?: boolean
  ): Promise<BodyGetStatusResponse>;

  call(
    module: 'captcha',
    method: 'fetch',
    params: CaptchaFetchParams,
    addSession?: boolean
  ): Promise<CaptchaFetchResponse>;

  call(
    module: 'captcha',
    method: 'solve',
    params: CaptchaSolveParams,
    addSession?: boolean
  ): Promise<CaptchaSolveResponse>;

  call(
    module: 'empire',
    method: 'create',
    params: EmpireCreateParams,
    addSession?: boolean
  ): Promise<EmpireCreateResponse>;

  call(
    module: 'empire',
    method: 'get_status',
    params: EmpireGetStatusParams,
    addSession?: boolean
  ): Promise<EmpireGetStatusResponse>;

  call(
    module: 'empire',
    method: 'fetch_captcha',
    params: EmpireFetchCaptchaParams,
    addSession?: boolean
  ): Promise<EmpireFetchCaptchaResponse>;

  call(
    module: 'empire',
    method: 'login',
    params: EmpireLoginParams,
    addSession?: boolean
  ): Promise<EmpireLoginResponse>;

  call(
    module: 'empire',
    method: 'logout',
    params: EmpireLogoutParams,
    addSession?: boolean
  ): Promise<EmpireLogoutResponse>;

  call(
    module: 'essentiavein',
    method: 'drain',
    params: EssentiaVeinDrainParams,
    addSession?: boolean
  ): Promise<EssentiaVeinDrainResponse>;

  call(module: string, method: string, params: any, addSession = true): Promise<any> {
    return new Promise((resolve, reject) => {
      server.call({
        module,
        method,
        params,
        addSession,
        success: (res: any) => {
          resolve(res);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }
}

export default ClientBase;
