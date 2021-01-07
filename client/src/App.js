/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';

import Layout from './components/layout';
import CustomPagination from './components/pagination';
import TopFilters from './components/topFilters';

import { getTransactionList } from './apiCalls/transactionApi';
import { TRANSACTION_TYPES, PAGINATION_DATA_LIMIT } from './constants';

const App = () => {
  const csvDownRef = useRef(null);
  const [data, setData] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [excelSheetData, setExcelSheetData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState({});
  const [filters, setFilters] = useState({
    skip: 0,
    limit: PAGINATION_DATA_LIMIT
  });

  const excelSheetHeader = [
    { label: 'ID', key: 'id' },
    { label: 'Business ID', key: 'businessId' },
    { label: 'Business Name', key: 'name' },
    { label: 'Business Email', key: 'email' },
    { label: 'Type', key: 'type' },
    { label: 'Amount', key: 'amount' },
    { label: 'Timestamp', key: 'timestamp' }
  ];

  const getData = (_query = filters) => {
    let query = '?skip=' + _query.skip + '&limit=' + _query.limit;

    if (_query.type) {
      query += '&type=' + _query.type;
    }

    if (_query.startDate) {
      query += '&startDate=' + _query.startDate;
    }

    if (_query.endDate) {
      query += '&endDate=' + _query.endDate;
    }

    getTransactionList(query)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setData(res.data.data);
          setTotalTransactions(res.data.count);
          setSelectedData([]);
          setExcelSheetData([]);
          setCheckedCheckboxes({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const paginationUpdated = (query) => {
    let newFilter = Object.assign({}, filters);
    newFilter.skip = query;
    setFilters(newFilter);
    getData(newFilter);
  };

  const filterData = (_query) => {
    let newFilter = Object.assign({}, filters);
    newFilter.skip = 0;

    if (_query.type !== 'All') {
      newFilter.type = _query.type;
    } else if (newFilter.type) {
      delete newFilter.type;
    }

    if (_query.startDate !== null) {
      newFilter.startDate = _query.startDate;
    } else if (_query.startDate === null) {
      delete newFilter.startDate;
    }

    if (_query.endDate !== null) {
      newFilter.endDate = _query.endDate;
    } else if (_query.endDate === null) {
      delete newFilter.endDate;
    }
    setFilters(newFilter);
    getData(newFilter);
  };

  useEffect(() => {
    getData();
  }, []);

  const saveSelectedExcelSheetData = async (item, value) => {
    let newData = selectedData;
    let newCheckBoxesData = Object.assign({}, checkedCheckboxes);

    if (value === true) {
      let e = {};
      e.id = item._id;
      e.businessId = item.businessId._id;
      e.name = item.businessId.name;
      e.email = item.businessId.email;
      e.type = TRANSACTION_TYPES[item.type];
      e.amount = item.amount;
      e.timestamp = item.timestamp;

      newData.push(e);
      newCheckBoxesData[item._id] = true;
    } else {
      newData = selectedData.filter((itm) => itm.id !== item._id);
      delete newCheckBoxesData[item._id];
    }

    setSelectedData(newData);
    setCheckedCheckboxes(newCheckBoxesData);
  };

  const exportData = async (all = false) => {
    if (totalTransactions > 0) {
      if (all === true) {
        const excelArray = [];

        await data.forEach(function (item) {
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
        // after setting the excel sheet data trigger the csv download component click event
        csvDownRef.current.link.click();
      } else if (selectedData.length > 0) {
        console.log(selectedData);
        setExcelSheetData(selectedData);
        csvDownRef.current.link.click();
      }
    }
  };

  return (
    <Layout>
      <h2>Transactions List</h2>
      <br />
      <div className="row justify-content-end">
        <button
          className="btn btn-primary mr-3 mb-4"
          onClick={() => exportData(true)}
        >
          Export All
        </button>
        <button className="btn btn-primary mb-4" onClick={() => exportData()}>
          Export Selected
        </button>

        <CSVLink
          style={{ display: 'none' }}
          ref={csvDownRef}
          filename={'Transactions_List.csv'}
          data={excelSheetData}
          headers={excelSheetHeader}
        ></CSVLink>
      </div>
      <TopFilters filterData={filterData} />
      {totalTransactions === 0 && <p>No Transaction Found</p>}
      {totalTransactions > 0 && (
        <Fragment>
          <table className="table mb-b">
            <thead>
              <tr>
                <th></th>
                <th>Business ID</th>
                <th>Business Name</th>
                <th>Business Email</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedCheckboxes[item._id] ? true : false}
                      onChange={(e) =>
                        saveSelectedExcelSheetData(item, e.target.checked)
                      }
                    ></input>
                  </td>
                  <td>{item.businessId._id}</td>
                  <td>{item.businessId.email}</td>
                  <td>{item.businessId.name}</td>
                  <td>{TRANSACTION_TYPES[item.type]}</td>
                  <td>{item.amount}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <CustomPagination
            skip={filters.skip}
            totalData={totalTransactions}
            paginationUpdated={paginationUpdated}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default App;
