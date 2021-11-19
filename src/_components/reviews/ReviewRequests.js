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
import { UpdateReview } from '../../_services/review.service';
import { useSnackbar } from 'notistack';
import Rating from '@material-ui/lab/Rating';
import { GetAllByRevrId } from '../../_services/review.service';
import storage from '../../_helpers/Storage';

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

const RatingElement = props => {
  const [rating, setRating] = useState(props.rowData.rating);
  return (
    <Rating
      name={`rating-${props.rowData._id}`}
      value={rating}
      onChange={(ev, val) => {
        const newData = props.rowData;
        newData.rating = val;
        props.onRowUpdate(newData);
        setRating(val);
      }}
    />
  );
};

const GridView = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = storage.getUser();

  const onRowUpdate = newData => {
    UpdateReview(user._id, newData)
      .then(d => {
        if (d) {
          setState(prevState => {
            const data = [...prevState.data];
            const oldData = data.find(x => x._id === newData._id);
            data[data.indexOf(oldData)] = newData;
            return { ...prevState, data };
          });
          enqueueSnackbar(`Successfully rated ${newData.name}!`, {
            variant: 'success'
          });
        } else {
          throw new Error('error');
        }
      })
      .catch(err => {
        console.error(err);
        enqueueSnackbar(`Error occured while rating ${newData.name}!`, {
          variant: 'error'
        });
        loadData();
      });
  };

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name', editable: 'never' },
      {
        title: 'Rating',
        field: 'rating',
        render: rowData => {
          const props = { rowData, onRowUpdate };
          return <RatingElement {...props} />;
        }
      }
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

  const loadData = () => {
    GetAllByRevrId(user._id)
      .then(data => {
        if (data) {
          setState({ ...state, data });
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Network error while accessing Review requests', {
          variant: 'error'
        });
      });
  };

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    if (isLoading && isMounted.current) {
      // loadData();
      GetAllByRevrId(user._id)
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
      title='Review requests'
      isLoading={isLoading}
      icons={tableIcons}
      columns={state.columns}
      data={state.data}
      options={state.options}
    />
  );
};

const Employees = ({ updateHeader }) => {
  updateHeader('Review Requests');
  const useStyles = makeStyles(() => ({}));
  const classes = useStyles();
  return (
    <>
      <GridView classes={classes} />
    </>
  );
};

export default Employees;
