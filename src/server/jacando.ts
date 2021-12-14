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
        return reject(new Error(`Jacando status: ${statusCode} - ${httpRes.statusMessage}`));
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

// T um type für alle responses zu geben, kann man aber auch zb bei .get<Type>()
const jacando = <T = unknown>(collection: string) => ({
  get: <Res = T>(resource?: string | number) => {
    const path =
      typeof resource === 'string' // wenn string dann id
        ? `${collection}/${resource}`
        : typeof resource === 'number' // wenn number dann page
        ? `${collection}?page=${resource}`
        : collection;
    return jacandoAPI<undefined, Res>('get', path);
  },

  // eslint-disable-next-line arrow-body-style
  post: <Req = unknown, Res = T>(data: Req) => {
    return jacandoAPI<Req, Res>('post', collection, data);
  },

  put: <Req = unknown, Res = T>(resource: string, data: Req) => {
    const path = `${collection}/${resource}`;
    return jacandoAPI<Req, Res>('put', path, data);
  },

  delete: <Res = T>(resource: string) => {
    const path = `${collection}/${resource}`;
    return jacandoAPI<undefined, Res>('delete', path);
  },
});

export default jacando;
