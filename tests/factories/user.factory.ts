export const createUser = (overrides = {}) => ({
  id: 'usr_123',
  email: 'test@vynta.ai',
  name: 'Test User',
  role: 'USER',
  password: 'hashedpassword',
  ...overrides,
});
