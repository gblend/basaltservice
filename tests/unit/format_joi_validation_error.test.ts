import { formatValidationError } from '../../src/lib/utils';

describe('FormatJoiValidationError', () => {
  it('should return empty array, when details contain 1 empty message', () => {
    const error = {
      details: [
        {
          message: '',
        },
      ],
    };

    expect(formatValidationError(error).length).toEqual(1);
    expect(formatValidationError(error)[0]).toBe(error.details[0].message);
  });

  it('should return array of messages with length 2, when details contain 2 messages', () => {
    const error = {
      details: [
        {
          context: {
            limit: 1979,
            value: 1980,
            key: 'summary',
            label: 'summary',
          },
          message: 'summary must be equal to or less then 1978 " characters',
          path: ['service', 1, 'summary'],
          type: 'number.max',
        },
        {
          context: {
            limit: 1979,
            value: 1983,
            key: 'summary',
            label: 'summary',
          },
          message: 'summary must be equal to or less then 1979 characters',
          path: ['service', 2, 'summary'],
          type: 'number.max',
        },
      ],
    };

    expect(formatValidationError(error).length).toEqual(2);
    expect(formatValidationError(error)[1]).toBe(error.details[1].message);
  });

  it('should return array of message with length 1, when details contain 1 message', () => {
    const error = {
      details: [
        {
          message: 'summary must be equal to or less then 1978 characters',
        },
      ],
    };

    expect(formatValidationError(error).length).toEqual(1);
    expect(formatValidationError(error)[0]).toBe(error.details[0].message);
  });
});
