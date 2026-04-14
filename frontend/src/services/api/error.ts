import axios from 'axios';

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return detail
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          }

          if (typeof item?.msg === 'string') {
            return item.msg;
          }

          return null;
        })
        .filter(Boolean)
        .join(', ');
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
