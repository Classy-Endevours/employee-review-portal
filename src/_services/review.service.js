import { authHeader } from '../_helpers/AuthHeader';
import { callApi } from './common.service';

export const GetAllByRevrId = _id => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return callApi(`reviews/${_id}`, requestOptions);
};

export const UpdateReview = (usr_id, review) => {
  return callApi(`reviews/${usr_id}`, {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  });
};