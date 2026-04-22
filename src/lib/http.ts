export async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const body = await response.text();
    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content type'}: ${body.slice(0, 120)}`
    );
  }

  return response.json() as Promise<T>;
}
