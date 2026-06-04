import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of `value` that only updates after `delayMs`
 * milliseconds of inactivity. Useful for delaying API calls on input change.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
