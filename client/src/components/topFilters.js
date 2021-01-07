/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datepicker/dist/react-datepicker.css';

import { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { CSVDownload } from 'react-csv';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { TRANSACTION_TYPES } from '../constants';
import { convertToUTCTimezone } from '../utils';
import { getTransactionList } from '../apiCalls/businessApi';

const TopFilters = ({ selectedBussinesses, allBusinesses }) => {
  const [selectedType, setSelectedType] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [excelSheetData, setExcelSheetData] = useState([]);
  const [activateDownload, setActivateDownload] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState('');

  const excelSheetHeader = [
    { label: 'ID', key: 'id' },
    { label: 'Business ID', key: 'businessId' },
    { label: 'Business Name', key: 'name' },
    { label: 'Business Email', key: 'email' },
    { label: 'Type', key: 'type' },
    { label: 'Amount', key: 'amount' },
    { label: 'Timestamp', key: 'timestamp' }
  ];

  const exportData = (all = false) => {
    if (selectedBussinesses.length > 0 || all === true) {
      let query = {};

      if (selectedType !== 'All') {
        query.type = selectedType;
      }

      if (startDate !== null) {
        query.startDate = convertToUTCTimezone(startDate);
      }

      if (endDate !== null) {
        query.endDate = convertToUTCTimezone(endDate);
      }

      if (all === true) {
        query.businesses = allBusinesses;
      } else {
        query.businesses = selectedBussinesses;
      }

      getTransactionList(query)
        .then(async (res) => {
          if (res.status === 200) {
            setExcelSheetData([]);

            if (res.data.length > 0) {
              const excelArray = [];

              await res.data.forEach(function (item) {
                let e = {};
                e.id = item._id;
                e.businessId = item.businessId._id;
                e.name = item.businessId.name;
                e.email = item.businessId.email;
                e.type = TRANSACTION_TYPES[item.type];
                e.amount = item.amount;
                e.timestamp = item.timestamp;

                excelArray.push(e);
              });

              setExcelSheetData(excelArray);
              setActivateDownload(true);
            } else {
              setModalText('No Transaction Found');
              toggle();
            }
          } else {
            setModalText('Some error occurred. Please try again!');
            toggle();
          }
        })
        .catch((err) => {
          setModalText('Some error occurred. Please try again!');
          toggle();
        });
    }
  };

  useEffect(() => {
    if (activateDownload === true) {
      setActivateDownload(false);
    }
  }, [activateDownload]);

  const toggle = () => setModal(!modal);

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
  };

  const CustomDateInput = forwardRef(
    ({ value, onClick, onChange, placeholder }, ref) => (
      <input
        ref={ref}
        type="text"
        value={value}
        className="form-control"
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
      ></input>
    )
  );

  return (
    <div className="row justify-content-end">
      <select
        value={selectedType}
        onChange={handleTypeFilter}
        className="form-control col-md-3 col-sm-12 mb-4 select-styles"
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
          placeholderText="Start Date"
          maxDate={new Date()}
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
          minDate={startDate}
          placeholderText="End Date"
          maxDate={new Date()}
        />
      </div>
      <button
        className="btn btn-primary mr-3 mb-4"
        onClick={() => exportData(true)}
      >
        Export All
      </button>
      <button
        className="btn btn-primary mb-4 mr-3"
        onClick={() => exportData()}
      >
        Export Selected
      </button>
      <button className="btn btn-primary mb-4 mr-3" onClick={clearFilters}>
        Clear
      </button>
      {activateDownload === true && (
        <CSVDownload
          data={excelSheetData}
          headers={excelSheetHeader}
          target="_blank"
        />
      )}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column justify-content-center align-items-center pb-4">
            <h3 className="text-center mb-4">{modalText}</h3>
            <button className="btn btn-primary pl-4 pr-4" onClick={toggle}>
              Close
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TopFilters;
