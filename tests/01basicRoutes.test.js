
const axios=require('axios')

const debug = false

describe('basic routes test', () => {
  beforeAll(() => { });

  beforeEach(() => { });

  afterEach(() => { });

  afterAll(() => { });

  test('load file', async () => {
    const debug = false
 
    const options = {
      method: 'POST',
      url: 'http://localhost:8080/storeFile',
      headers: {
        'content-type': 'application/json'
      },
      data: "Hello World"
    }
    const response = await axios.request(options)

    expect(response.data).toEqual(1)

  });

});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

