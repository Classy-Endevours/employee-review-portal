import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { makeStyles, useTheme, CircularProgress } from '@material-ui/core';
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
  ViewColumn,
  RateReview,
  RateReviewOutlined
} from '@material-ui/icons';
import {
  GetAll,
  AddEmployee,
  UpdateEmployee,
  DeleteEmployee
} from '../../_services/employee.service';
import { useSnackbar } from 'notistack';
import { AssignReviewers } from './AssignReviewers';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmps } from '../../redux/actions';

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

const GridView = ({ classes }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const emps = useSelector(state => state.employees);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'UserName', field: 'username' }
    ],
    data: emps,
    options: {
      headerStyle: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.background.default,
        fontWeight: 'bolder'
      }
    }
  });

  const dispatch = useDispatch();

  const loadData = () => {
    GetAll()
      .then(data => {
        dispatch(loadEmps(data));
        setState({ ...state, data });
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Network error while accessing employees list!', {
          variant: 'error'
        });
      });
  };

  const setToLoad = isLoading => {
    setIsLoading(isLoading);
  };

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    if (isLoading && isMounted.current) {
      GetAll()
        .then(data => {
          if (isMounted.current) {
            dispatch(loadEmps(data));
            setState({ ...state, data });
            setIsLoading(false);
          }
          isMounted.current = false;
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar('Network error while accessing employees list!', {
            variant: 'error'
          });
        });
    }
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    setState(prevState => {
      return { ...prevState, data: emps };
    });
  }, [emps]);

  return (
    <MaterialTable
      title='Employee List'
      isLoading={isLoading}
      icons={tableIcons}
      columns={state.columns}
      data={state.data}
      options={state.options}
      detailPanel={[
        {
          icon: () => <RateReviewOutlined />,
          openIcon: () => <RateReview />,
          tooltip: 'Assign Reviewers',
          render: rowData => {
            const rowDt = state.data.find(x => x._id === rowData._id);
            rowDt.loadData = loadData;
            rowDt.setToLoad = setToLoad;
            return <AssignReviewers {...rowDt} />;
          }
        }
      ]}
      editable={{
        onRowAdd: newData => {
          return AddEmployee(newData)
            .then(res => {
              setState(prevState => {
                const data = [...prevState.data];
                data.push(res);
                dispatch(loadEmps(data));
                return { ...prevState, data };
              });
              enqueueSnackbar(`Successfully added employee ${newData.name}!`, {
                variant: 'success'
              });
            })
            .catch(err => {
              console.error(err);
              enqueueSnackbar(
                `Network error occured while adding ${newData.name}!`,
                {
                  variant: 'error'
                }
              );
            });
        },
        onRowUpdate: (newData, oldData) => {
          return UpdateEmployee(newData)
            .then(res => {
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  dispatch(loadEmps(data));
                  return { ...prevState, data };
                });
                enqueueSnackbar(
                  `Successfully updated employee ${newData.name}!`,
                  {
                    variant: 'success'
                  }
                );
              }
            })
            .catch(err => {
              console.error(err);
              enqueueSnackbar(
                `Network error occured while updating ${newData.name}!`,
                {
                  variant: 'error'
                }
              );
            });
        },
        onRowDelete: oldData => {
          return DeleteEmployee(oldData)
            .then(res => {
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
                enqueueSnackbar(
                  `Successfully deleted employee ${oldData.name}!`,
                  {
                    variant: 'success'
                  }
                );
              }
            })
            .catch(err => {
              console.error(err);
              enqueueSnackbar(
                `Network error occured while deleting ${oldData.name}!`,
                {
                  variant: 'error'
                }
              );
            });
        }
      }}
    />
  );
};

const Employees = ({ updateHeader }) => {
  updateHeader('Employees');
  const useStyles = makeStyles(theme => ({}));
  const classes = useStyles();
  return (
    <>
      <GridView classes={classes} />
    </>
  );
};

export default Employees;
