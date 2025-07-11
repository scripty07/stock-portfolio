import { TICKER_API_KEY } from '../constants/endpoints';

export const getAuthHeader = () => {
  return {
    Authorization: `Bearer ${TICKER_API_KEY}`,
  };
};
