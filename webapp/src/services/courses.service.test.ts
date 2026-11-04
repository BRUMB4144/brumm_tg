import { afterEach, expect, test, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
vi.stubGlobal('localStorage', { getItem: () => null });
const { coursesService } = await import('./courses.service');
const { axiosInstance } = await import('../API/axios.api');
afterEach(() => vi.restoreAllMocks());
const notFound = (message: string) => new AxiosError('not found', undefined, undefined, undefined,
  { status: 404, statusText: '', data: { message }, headers: new AxiosHeaders(), config: { headers: new AxiosHeaders() } });
test('first and last lesson have no neighbour without failing the current lesson', async () => {
  vi.spyOn(axiosInstance, 'get').mockRejectedValueOnce(notFound('No previous lesson available')).mockRejectedValueOnce(notFound('No next lesson available'));
  expect(await coursesService.getLessonPrev('c', 'first')).toBeNull();
  expect(await coursesService.getLessonNext('c', 'last')).toBeNull();
});
test('missing course and network failure remain failures', async () => {
  const get = vi.spyOn(axiosInstance, 'get').mockRejectedValueOnce(notFound('Course not found'));
  await expect(coursesService.getLessonNext('missing', 'l')).rejects.toThrow();
  get.mockRejectedValueOnce(new AxiosError('network'));
  await expect(coursesService.getLessonPrev('c', 'l')).rejects.toThrow('network');
});
