/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { TRANSACTION_TYPES } from '../constants';
import { convertToUTCTimezone } from '../utils';

const TopFilters = ({ filterData }) => {
  const [selectedType, setSelectedType] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const applyFilters = (
    filters = {
      type: selectedType,
      startDate: convertToUTCTimezone(startDate),
      endDate: convertToUTCTimezone(endDate)
    }
  ) => {
    console.log(convertToUTCTimezone(startDate));
    filterData(filters);
  };

  const handleTypeFilter = (e) => {
    setSelectedType(e.target.value);
  };

  const renderTypes = () => {
    let res = [];

    for (const key in TRANSACTION_TYPES) {
      res.push(
        <option key={key} value={key}>
          {TRANSACTION_TYPES[key]}
        </option>
      );
    }

    return res;
  };

  const clearFilters = () => {
    setSelectedType('All');
    setStartDate(null);
    setEndDate(null);
    applyFilters({
      type: 'All',
      startDate: null,
      endDate: null
    });
  };

  const CustomDateInput = ({ value, onClick, onChange }) => (
    <input
      type="text"
      value={value}
      className="form-control"
      onClick={onClick}
      onChange={onChange}
    ></input>
  );

  return (
    <div className="row justify-content-end">
      <select
        onChange={handleTypeFilter}
        className="form-control col-md-3 col-sm-12 mb-4"
      >
        <option value="All">All</option>
        {renderTypes()}
      </select>
      <div className="col-md-2 col-sm-12 mb-4">
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
          }}
          customInput={<CustomDateInput />}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className="col-md-2 col-sm-12 mb-4">
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
          }}
          customInput={<CustomDateInput />}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
      <button
        onClick={() => applyFilters()}
        className="btn btn-primary col-md-1 col-sm-12 mb-4 mr-0 mr-sm-0 mr-md-2 "
      >
        Apply
      </button>
      <button
        onClick={clearFilters}
        className="btn btn-primary col-md-1 col-sm-12 mb-4"
      >
        Clear
      </button>
    </div>
  );
};

export default TopFilters;
