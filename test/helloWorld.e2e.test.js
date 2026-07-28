import axios from 'axios';

describe('When calling /hello', () => {
  it('should return 200', async () => {
    // ARRANGE
    const options = {
      baseURL: process.env.API_URL,
      validateStatus: () => true,
    };
    const path = '/hello';

    // ACT
    const { status } = await axios.get(path, options);

    // ASSERT
    expect(status).toEqual(200);
  });
});
