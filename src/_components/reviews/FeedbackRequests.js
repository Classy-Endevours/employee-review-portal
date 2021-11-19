import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core';
import MaterialTable from 'material-table';
import {
  AddBox,
  Check,
  Clear,
  DeleteOutline,
  ChevronRight,
  Edit,
  SaveAlt,
  FilterList,
  FirstPage,
  LastPage,
  ChevronLeft,
  Search,
  ArrowDownward,
  Remove,
  ViewColumn
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import Rating from '@material-ui/lab/Rating';
import storage from '../../_helpers/Storage';
import {
  GetAllFBRById,
  UpdateFeedback
} from '../../_services/feedback.service';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const GridView = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = storage.getUser();

  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Reviewer',
        field: 'reviewer.name',
        editable: 'never'
      },
      {
        title: 'Rating',
        field: 'rating',
        render: rowData => (
          <Rating name='rating' value={rowData.rating} readOnly />
        ),
        editable: 'never'
      },
    ],
    data: [],
    options: {
      headerStyle: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.background.default,
        fontWeight: 'bolder'
      }
    }
  });

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    if (isLoading && isMounted.current) {
      GetAllFBRById(user._id)
        .then(data => {
          if (data && isMounted.current) {
            setState({ ...state, data });
            setIsLoading(false);
            isMounted.current = false;
          }
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar('Network error while accessing Review requests', {
            variant: 'error'
          });
        });
    }
    return () => (isMounted.current = false);
  }, []);

  return (
    <MaterialTable
      title='Feedback requests'
      icons={tableIcons}
      columns={state.columns}
      data={state.data}
      options={state.options}
    />
  );
};

const Employees = ({ updateHeader }) => {
  updateHeader('Feedback Requests');
  const useStyles = makeStyles(() => ({}));
  const classes = useStyles();
  return (
    <>
      <GridView classes={classes} />
    </>
  );
};

export default Employees;
