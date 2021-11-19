import React from 'react';
import Container from '@material-ui/core/Container';
import { Route, Switch } from 'react-router-dom';
import Employees from '../_components/employees/Employees';
import ReviewReq from '../_components/reviews/ReviewRequests';
import FeedbackReq from '../_components/reviews/FeedbackRequests';

const DashContainer = ({ classes, updateHeader, fixedHeightPaper, role }) => {
  const routes = [
    {
      path: '/',
      exact: true,
      component: props => (
        <Employees
          {...props}
          updateHeader={updateHeader}
          fixedHeightPaper={fixedHeightPaper}
          classes={classes}
        />
      ),
      role: ['admin']
    },
    {
      path: role === 'admin' ? '/review' : '/',
      exact: true,
      component: props => (
        <ReviewReq
          {...props}
          updateHeader={updateHeader}
          fixedHeightPaper={fixedHeightPaper}
          classes={classes}
        />
      ),
      role: [undefined, 'admin', 'user']
    },
    {
      path: '/feedback',
      exact: true,
      component: props => (
        <FeedbackReq
          {...props}
          updateHeader={updateHeader}
          fixedHeightPaper={fixedHeightPaper}
          classes={classes}
        />
      ),
      role: [undefined, 'admin', 'user']
    }
  ];

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Switch>
        {routes
          .filter(d => d.role.includes(role))
          .map((r, i) => (
            <Route key={i} {...r} />
          ))}
      </Switch>
    </Container>
  );
};

export default DashContainer;
