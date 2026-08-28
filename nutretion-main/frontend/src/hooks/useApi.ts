import { useState, useCallback } from 'react';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        const msg = response.error?.message || 'An error occurred';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Network request failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, setError, execute };
}
