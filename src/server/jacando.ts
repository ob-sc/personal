import https from 'https';
import { jacandoConfig } from '../../config';

// returned ein promise mit daten / error
function jacandoAPI<Req = unknown, Res = unknown>(
  method: 'get' | 'post' | 'put' | 'delete',
  resource: string,
  data?: Req
): Promise<Res> {
  return new Promise((resolve, reject) => {
    const upperCaseMethod = method?.toUpperCase();
    // leeres Uint8Array als fallback
    const encodedData =
      data !== undefined ? new TextEncoder().encode(JSON.stringify(data)) : new Uint8Array();

    const options: https.RequestOptions = {
      hostname: 'eux.jacando.io',
      port: 443,
      path: `/x/api/${resource}`,
      method: upperCaseMethod,
      headers: {
        Authorization: `Bearer ${jacandoConfig}`,
      },
    };

    if (upperCaseMethod !== 'GET' && upperCaseMethod !== 'DELETE') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Content-Length': encodedData.length,
      };
    }

    const httpReq = https.request(options, (httpRes) => {
      const statusCode = httpRes.statusCode === undefined ? 'undefined' : httpRes.statusCode;
      if (statusCode === 'undefined' || statusCode < 200 || statusCode >= 300) {
        return reject(new Error(`Jacando status code ${statusCode}`));
      }

      const body: Buffer[] = [];

      httpRes.on('data', (chunk) => {
        body.push(chunk);
      });

      httpRes.on('end', () => {
        try {
          const response = JSON.parse(Buffer.concat(body).toString()) as Res;
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    httpReq.on('error', (error) => {
      reject(error.message);
    });

    httpReq.end();
  });
}

class Jacando {
  public resource: string;
  constructor(resource: string) {
    this.resource = resource;
  }
  get<Res = unknown>() {
    return jacandoAPI<never, Res>('get', this.resource);
  }
  post<Req = unknown, Res = unknown>(data: Req) {
    return jacandoAPI<Req, Res>('post', this.resource, data);
  }
  put<Req = unknown, Res = unknown>(data: Req) {
    return jacandoAPI<Req, Res>('put', this.resource, data);
  }
  delete<Res = unknown>() {
    return jacandoAPI<never, Res>('delete', this.resource);
  }
  // keine persönlichen Daten
}

jacandoAPI<string>('get', '/bla');

export default Jacando;
