const apiUrl = 'http://localhost:5513/api';

export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrl}/users/register`,
    Login: `${apiUrl}/users/login`,
    Me: `${apiUrl}/users/me`,
  },
  User: {
    All: `${apiUrl}/users`,
  },
  role: {
    All: `${apiUrl}/role`,
  },
  forgotPassword: {
    recover: `${apiUrl}/users/forgetpassword`,
  },

  ConfirmPassword: {
    Resetpassword: `${apiUrl}/users/resetpassword`,
  },
};

export const LocalStorage = {
  token: 'USER_TOKEN',
  role: 'USER_ROLE',
};
