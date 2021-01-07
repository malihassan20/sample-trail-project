import axios from 'axios';

import {
  getTransactionListApiRoute,
  getBusinessListApiRoute
} from '../apiRoutes';

export function getBusinessList(filters = '') {
  return axios
    .get(getBusinessListApiRoute + filters)
    .then((res) => res)
    .catch((err) => err.response);
}

export function getTransactionList(filters = {}) {
  return axios
    .post(getTransactionListApiRoute, filters)
    .then((res) => res)
    .catch((err) => err.response);
}
