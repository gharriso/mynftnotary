import axios from 'axios'
import fs from 'fs'

const debug = false

describe('basic routes test', () => {
  beforeAll(() => {});

  beforeEach(() => {});

  afterEach(() => {});

  afterAll(() => {});

  test('load file', async () => {
    const debug = false

    const options = {
      method: 'POST',
      url: 'http://localhost:8080/storeFile',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        data: "Hello World"
      }
    }
    const response = await axios.request(options)


    expect(Object.keys(response.data)).toContainEqual("cid")

  });
  test('load PDF', async () => {
    const debug = false
    const data = await fs.readFileSync('tests/ABNRegistration.pdf', 'base64')
    const options = {
      method: 'POST',
      url: 'http://localhost:8080/storeFile',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        data
      }
    }
    const response = await axios.request(options)

    console.log(response.data)
    
    expect(Object.keys(response.data)).toContainEqual("cid")

  });
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}