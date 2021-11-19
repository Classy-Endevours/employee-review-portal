/* eslint-disable no-use-before-define */

import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Check } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { UpdateEmployee } from '../../_services/employee.service';
import { useSelector, useDispatch } from 'react-redux';
import update from 'immutability-helper';
import { loadEmps } from '../../redux/actions';
import { useSnackbar } from 'notistack';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

export const AssignReviewers = props => {
  const employees = useSelector(state => state.employees);
  const dispatch = useDispatch();
  const [fEmps, setFEmps] = useState(
    employees.map(d => {
      return { name: d.name, _id: d._id };
    })
  );
  const [reviewers, setReviewers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  // const [employees, setEmployees] = useState([]);

  const handleOnClick = event => {
    props.setToLoad(true);
    const currentEmp = employees.find(d => d._id === props._id);
    const currentEmpIdx = employees.indexOf(currentEmp);
    const revDocs = reviewers.map(d => {
      return { revr_id: d._id, fb_status: 'Not Approved' }; // set default status of feedback
    });
    const updatedEmps = update(employees, {
      [currentEmpIdx]: { reviewDocs: { $set: [...revDocs] } }
    });
    currentEmp.reviewDocs = [...revDocs];
    UpdateEmployee(currentEmp)
      .then(res => {
        dispatch(loadEmps(updatedEmps));
        enqueueSnackbar('Successfully assigned reviewers!', {
          variant: 'success'
        });
        props.loadData();
      })
      .catch(er => {
        enqueueSnackbar('Network error while assigning reviewer', {
          variant: 'error'
        });
        console.error(er);
      });
  };

  useEffect(() => {
    const assigned = props.reviewDocs
      ? props.reviewDocs.map(d => d.revr_id)
      : [];
    const assEmps = fEmps
      .filter(d => assigned.includes(d._id))
      .map(d => {
        return { name: d.name, _id: d._id };
      });
    const fe = fEmps
      .filter(d => d._id !== props._id)
      .map(d => {
        return { name: d.name, _id: d._id };
      });
    setFEmps(fe);
    setReviewers(assEmps);
  }, [props.reviewDocs]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        multiple
        id='assign-reviewers'
        options={fEmps}
        disableCloseOnSelect
        value={reviewers}
        getOptionLabel={option => option.name}
        onChange={(event, newValue) => {
          setReviewers(newValue);
        }}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={
                reviewers.map(d => d._id).includes(option._id) ? true : selected
              }
            />
            {option.name}
          </React.Fragment>
        )}
        style={{ width: '90%' }}
        renderInput={params => (
          <TextField
            style={{ width: '90%' }}
            {...params}
            variant='outlined'
            label='Reviewers'
            placeholder='Employees'
          />
        )}
      />
      <IconButton onClick={handleOnClick}>
        <Check />
      </IconButton>
    </div>
  );
};
