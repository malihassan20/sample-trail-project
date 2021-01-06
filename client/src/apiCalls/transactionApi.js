import axios from 'axios';

import { getTransactionListApiRoute } from '../apiRoutes';

export function getTransactionList(filters = '') {
  return axios
    .get(getTransactionListApiRoute + filters)
    .then((res) => res)
    .catch((err) => err.response);
}
