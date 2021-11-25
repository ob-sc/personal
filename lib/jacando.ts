import https from 'https';
import cfg from '../config';
import {
  APICustomFieldSection,
  Employee,
  JacandoAPI,
  JacandoUserRegion,
  JacandoUserStatus,
  User,
} from '../types/api';

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
          resolve(body);
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
  // keine persönlichen Daten
  parseUser(employee: Employee): User {
    const user: User = {
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      gender: employee.gender,
      personellNumber: Number(employee.personellNumber),
      clients: [...employee.clients],
      roles: [...employee.roles],
      updatedAt: employee.updatedAt,
      createdAt: employee.createdAt,
      publicEmail: employee.publicEmail,
      imageUrl: employee.imageUrl,
      archived: employee.archived,
      kst: 0,
      access: null,
      region: null,
      extrastation: null,
    };

    const sections = employee.customFieldSections ?? [];
    for (let i = 0; i < sections.length; i++) {
      const currentSection = sections[i];
      if (currentSection.names.de === 'API') {
        const acfs = currentSection as APICustomFieldSection;
        for (let j = 0; j < acfs.customFields.length; j++) {
          const currentField = acfs.customFields[j];
          const title = currentField.title.de;
          const { value } = currentField;
          // eslint-disable-next-line default-case
          switch (title) {
            case 'Kostenstelle':
              user.kst = Number(value);
              break;
            case 'Status':
              user.access = value.toLowerCase() as JacandoUserStatus;
              break;
            case 'Region':
              user.region = value.toLowerCase() as JacandoUserRegion;
              break;
            case 'Extrastation':
              if (value === '*') {
                user.extrastation = value;
              } else {
                // leerstellen entfernen
                const extraStationsString = value.replace(/\s+/g, '');
                const extraStations = extraStationsString.split(',');
                // array aus strings zu array aus numbers
                user.extrastation = extraStations.map((s) => Number(s));
              }
              break;
          }
        }
        // wenn ich "API" gefunden habe dann abbrechen
        break;
      }
    }
    return user;
  }
}

export default Jacando;
