import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'docker-as-lambda' });

describe('Aristotle says', () => {
  it('A is A', () => {
    logger.debug('import is working in jest test');
    expect('A').toBe('A');
  });
});

describe('Using jest-extended assertion', () => {
  it('should execute', () => {
    expect().pass('jest-extended is working');
  });
});
