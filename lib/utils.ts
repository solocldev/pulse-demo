import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function objectToQueryString(object: any) {
  const keys = Object.keys(object);
  const keyValuePairs = keys.map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
  });
  return keyValuePairs.join('&');
}
