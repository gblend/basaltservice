import Redis from 'ioredis';
import { config } from '../../config/config';
import { logger } from './logger';
const { port, password, db, family, host } = config.redis;

interface IConnectionOptions {
  port?: number;
  host?: string;
  family?: number;
  db?: number;
  password?: string;
}

export class Cache {
  private cache;

  private connectionOptions: IConnectionOptions = {
    port: port as number,
    host,
    password,
    family: family as number,
    db: db as number,
  };

  constructor() {
    this.cache = this.initRedisCache(this.connectionOptions);
  }

  initRedisCache(connectionOption: IConnectionOptions = {}): any {
    if (!this.cache) {
      this.cache = new Redis(connectionOption);
    }
    return this.cache;
  }

  /**
   *
   * @param {string} key the key to set its corresponding value
   * @param {*} value the value to set for the specified key
   * @param {number} ttl the time to live (TTL) in seconds set for the specified key
   * @returns {Promise<void>}
   */
  async set(key: string, value: any, ttl: number = 0): Promise<any> {
    value = JSON.stringify(value);

    if (ttl) {
      this.cache.set(key, value, 'EX', ttl);
    } else this.cache.set(key, value);
  }

  /**
   * Retrieves the value of specified key
   * @param {string} key the key to retrieve its value
   * @returns {Promise<*>}
   */
  async get(key: string): Promise<any> {
    return this.cache.get(key, (err: any, result: any) => {
      if (err) {
        logger.info(err.message);
      }

      return JSON.parse(result);
    });
  }

  /**
   * Delete a key from the redis cache
   * @param {string} key the key to delete
   * @returns {Promise<*>}
   */
  async delete(key: string): Promise<any> {
    return this.cache.del(key);
  }

  /**
   * Delete all key that match the key pattern specified
   * @param {string} key the key to match
   * @returns {Promise<void>}
   */
  async refresh(key: string): Promise<void> {
    this.cache.keys(`*${key}*`).then(async (properties: any) => {
      for (const property of properties) {
        await this.delete(property);
      }
    });
  }
}
