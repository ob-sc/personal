import https from 'https';
import cfg from '../config';
import { JacandoAPI } from '../types/jacando';

// returned ein promise mit daten / error
const jacandoAPI: JacandoAPI = (method, resource, data) =>
  new Promise((resolve, reject) => {
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
        Authorization: `Bearer ${cfg.jacando}`,
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

      let body: Buffer[] = [];

      httpRes.on('data', (chunk) => {
        body.push(chunk);
      });

      httpRes.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });

    httpReq.on('error', (error) => {
      reject(error.message);
    });

    httpReq.end();
  });

class Jacando {
  resource: string;
  constructor(resource: string) {
    this.resource = resource;
  }
  get() {
    return jacandoAPI('get', this.resource);
  }
  post(data: any) {
    return jacandoAPI('post', this.resource, data);
  }
  put(data: any) {
    return jacandoAPI('put', this.resource, data);
  }
  delete() {
    return jacandoAPI('delete', this.resource);
  }
}

export default Jacando;
