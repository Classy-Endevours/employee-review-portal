import { authHeader } from '../_helpers/AuthHeader';
import { callApi } from './common.service';

export const GetAllFBRById = _id => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return callApi(`feedbacks/${_id}`, requestOptions);
};

export const UpdateFeedback = (usr_id, review) => {
  return callApi(`feedbacks/${usr_id}`, {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  });
};