export default {
  model: {
    type: 'object',
    properties: {
      firstname: {
        type: 'string',
        description: 'The user first name',
        required: true,
        example: 'John',
      },
      lastname: {
        type: 'string',
        required: true,
        description: 'The user last name',
        example: 'Doe',
      },
      email: {
        type: 'string',
        required: true,
        description: 'The user email address',
        example: 'johndoe@gmail.com',
      },
      password: {
        type: 'string',
        required: true,
        description: 'The user password',
        example: 'xx**xx22@@',
      },
      passwordConfirmation: {
        type: 'string',
        required: true,
        description: 'The user password confirmation',
        example: 'xx**xx22@@',
      },
      role: {
        type: 'string',
        description: 'The user role',
        example: 'admin',
      },
      verificationToken: {
        type: 'string',
        description: 'The user account verification token',
        example: 'arh399027ann3m4',
      },
      isVerified: {
        type: 'boolean',
        description: 'The user account verification status',
        example: true,
      },
      passwordToken: {
        type: 'string',
        description: 'The user account verification password token',
        example: 'arh399027ann3m4',
      },
      passwordTokenExpirationDate: {
        type: 'date',
        description:
          'The user account verification password token expiration date',
        example: '1970-01-01 01:01:00',
      },
    },
  },
  signupInput: {
    type: 'object',
    properties: {
      firstname: {
        type: 'string',
        description: 'The user first name',
        required: true,
        example: 'John',
      },
      lastname: {
        type: 'string',
        required: true,
        description: 'The user last name',
        example: 'Doe',
      },
      email: {
        type: 'string',
        required: true,
        description: 'The user email address',
        example: 'johndoe@example.com',
      },
      roleId: {
        type: 'number',
        required: true,
        description: 'The user role id',
        example: '1',
      },
      password: {
        type: 'string',
        required: true,
        description: 'The user password',
        example: 'xx**xx22@@',
      },
      passwordConfirmation: {
        type: 'string',
        required: true,
        description: 'The user password confirmation',
        example: 'xx**xx22@@',
      },
    },
  },
  signupSuccess: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'The request status',
        example: 'success',
      },
      message: {
        type: 'string',
        description: 'The response message',
        example: 'Please check your email for a link to verify your account',
      },
      data: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'The signup token',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
          },
          refreshToken: {
            type: 'string',
            description: 'The signup refresh token',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJHYWJyaWVsIElsb2NoaSIsImlkIjoiNjJhZmFkZGI3MWFlMDY1MzMwNzk4ZWQwIiwicm9sZSI6InVzZXIifSwicmVmcmVzaFRva2VuIjoiNmRmMzI0YTM2OGEzOTYwNjdiNWMxNDI3YzM1YTMyYjhjODRlZjBlMDM5YjU5ZTQ4Zjg5YjI0YWVlOWY3ZmJjYWVhMjhiODFlYWI3YjFmMWYiLCJpYXQiOjE2NTU2ODA0Nzd9._j1v5W-i8lYkXX439rFObA1s4h9EuYx6s2rISpH_Xl8',
          },
          user: {
            type: 'object',
            properties: {
              firstname: {
                type: 'string',
                description: 'The user first name',
                required: true,
                example: 'John',
              },
              lastname: {
                type: 'string',
                required: true,
                description: 'The user last name',
                example: 'Doe',
              },
              email: {
                type: 'string',
                required: true,
                description: 'The user email address',
                example: 'johndoe@gmail.com',
              },
              role: {
                type: 'string',
                description: 'The user role',
                example: 'admin',
              },
              isVerified: {
                type: 'boolean',
                description: 'The user account verification status',
                example: true,
              },
            },
          },
        },
      },
    },
  },
  signupError: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'The request status',
        example: 'error',
      },
      message: {
        type: 'string',
        description: 'The response message',
        example: 'Request failed',
      },
      data: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            example: ['Email address is already in use.'],
          },
        },
      },
    },
  },
  VerifyAccountInput: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Account verification token',
        example:
          'fcc0ac4edd239d804ba6586a727c609fd27321e9ee3ec3a2fe1f285c1a7936082b31d74b58bbbee8',
      },
      email: {
        type: 'string',
        description: 'Account email address',
        example: 'johndoe@example.com',
      },
    },
  },
  LoginInput: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        description: 'Account password',
        example: '**********',
      },
      email: {
        type: 'string',
        description: 'Account email address',
        example: 'johndoe@example.com',
      },
    },
  },
};
