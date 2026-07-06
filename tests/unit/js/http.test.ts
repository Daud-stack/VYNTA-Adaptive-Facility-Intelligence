import { describe, it, expect } from 'vitest';
import { readJsonResponse } from '../../../src/lib/http';

describe('readJsonResponse', () => {
  it('should parse and return JSON if content-type is application/json', async () => {
    const mockData = { success: true };
    const mockResponse = new Response(JSON.stringify(mockData), {
      headers: {
        'content-type': 'application/json',
      },
    });

    const result = await readJsonResponse<{ success: boolean }>(mockResponse);
    expect(result).toEqual(mockData);
  });

  it('should throw an Error if content-type is missing', async () => {
    const mockResponse = new Response('Not JSON', {
      headers: {}, // No content-type
    });

    await expect(readJsonResponse(mockResponse)).rejects.toThrowError(
      /Expected JSON but received text\/plain;charset=UTF-8: Not JSON/
    );
  });

  it('should throw an Error if content-type is text/html', async () => {
    const mockResponse = new Response('<html><body>Error</body></html>', {
      headers: {
        'content-type': 'text/html',
      },
    });

    await expect(readJsonResponse(mockResponse)).rejects.toThrowError(
      /Expected JSON but received text\/html: <html><body>Error<\/body><\/html>/
    );
  });
});
