import React from 'react';
import ListItemLink from './ListItemLink';
import { SupervisorAccount, RateReview, Feedback } from '@material-ui/icons';

export const MenuItems = ({ role }) => {
  const menus = [];
  console.log('role', role);
  if (role === 'admin')
    menus.push(
      <ListItemLink
        key='Employees'
        primary='Employees'
        to='/'
        icon={<SupervisorAccount />}
      />
    );
  menus.push(
    <ListItemLink
      key='Review'
      primary='Reveiw'
      to={role === 'admin' ? '/review' : '/'}
      icon={<RateReview />}
    />
  );
  menus.push(
    <ListItemLink
      key='Feedback'
      primary='Feedback'
      to='/feedback'
      icon={<Feedback />}
    />
  );
  return <div>{menus}</div>;
};
