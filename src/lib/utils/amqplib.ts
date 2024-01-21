import { Channel, connect, Connection } from 'amqplib';
import { config } from '../../config/config';
import { logger } from './logger';

let connection: any = '';
const { host, password, protocol, username, vhost } = config.amqp;

const initAmqpServer = async (): Promise<any> => {
  if (!connection) {
    return connect(
      {
        protocol,
        username,
        password,
        hostname: host,
        heartbeat: 60,
        vhost,
      },
      { prefetch: 1 },
    )
      .then((_connection: Connection) => {
        connection = _connection;
        return _connection;
      })
      .catch((error: any) => {
        throw new Error(error?.message);
      });
  }
  return connection;
};

const createAmqpChannel = async (
  queue: string,
): Promise<{ channel: Channel }> => {
  return await initAmqpServer()
    .then<{ channel: Channel }, never>(async (_connection: Connection) => {
      const channel = await _connection.createChannel();
      await channel.assertExchange(queue, 'direct', { durable: true });
      await channel.assertQueue(queue);
      return { channel };
    })
    .catch((error: any) => {
      throw new Error(error);
    });
};

const pushToQueue = async (queue: string, queueErrorMsg: string, data: any) => {
  try {
    const { channel: amqpChannel } = await createAmqpChannel(queue);
    /* The empty string as third parameter means that we don't want to send the message to any specific queue (routingKey).
        We want only to publish it to our exchange
        The parameters -- exchange, routingKey, content amqpChannel.publish(queue, queue.toLowerCase(),
        Buffer.from(JSON.stringify({ [queue]: data })));
        */
    const queueData: boolean = amqpChannel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ [queue]: data })),
    );
    if (!queueData) {
      logger.error(queueErrorMsg);
    }
  } catch (error: any) {
    logger.error('RabbitMQ queuing', error);
    throw new Error(error);
  }
};

const initConsumer = async (
  fn: (payload: any) => void,
  queue: string,
): Promise<void> => {
  try {
    const { channel: ch } = await createAmqpChannel(queue);
    await ch.assertExchange(queue, 'direct', { durable: true });
    // the parameters -- queue, exchange, bindingKey
    await ch.bindQueue(queue, queue, queue.toLowerCase());
    await ch.consume(queue, async (data: any) => {
      const queuePayload = JSON.parse(data.content);
      await fn(queuePayload[queue]);
      ch.ack(data);
    });
  } catch (error: any) {
    logger.error('RabbitMQ consumer', error);
  }
};

export { pushToQueue, initConsumer };
