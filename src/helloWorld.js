import middy from '@middy/core';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'docker-as-lambda' });

const hello = async (event) => {
  logger.debug('In handler hello()');

  return { message: 'Hello from your JS template!', event };
};

export const handler = middy(hello);
