/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import Layout from './components/layout';
import CustomPagination from './components/pagination';
import TopFilters from './components/topFilters';

import { getBusinessList } from './apiCalls/businessApi';
import { PAGINATION_DATA_LIMIT } from './constants';

const App = () => {
  const [businesses, setBusinesses] = useState([]);
  const [totalBusiness, setTotalBusiness] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState({});
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: PAGINATION_DATA_LIMIT
  });

  const getBusinessData = (_query = filters) => {
    let query = '?skip=' + _query.skip + '&limit=' + _query.limit;
    getBusinessList(query)
      .then((res) => {
        if (res.status === 200) {
          setBusinesses(res.data.data);
          setTotalBusiness(res.data.count);
          setSelectedData([]);
          setCheckedCheckboxes({});
        }
      })
      .catch((err) => {
        toggle();
      });
  };

  useEffect(() => {
    getBusinessData();
  }, []);

  const toggle = () => setModal(!modal);

  const paginationUpdated = (query) => {
    let newFilter = Object.assign({}, filters);
    newFilter.skip = query;
    setFilters(newFilter);
    getBusinessData(newFilter);
  };

  const saveSelectedData = async (item, value) => {
    let newData = selectedData;
    let newCheckBoxesData = Object.assign({}, checkedCheckboxes);

    if (value === true) {
      newCheckBoxesData[item._id] = true;
      newData.push(item._id);
    } else {
      newData = selectedData.filter((itm) => itm !== item._id);
      delete newCheckBoxesData[item._id];
    }

    setSelectedData(newData);
    setCheckedCheckboxes(newCheckBoxesData);
  };

  return (
    <Layout>
      <h2>Transactions List</h2>
      <br />
      <TopFilters
        allBusinesses={businesses}
        selectedBussinesses={selectedData}
      />
      {totalBusiness === 0 && <p>No Business Found</p>}
      {totalBusiness > 0 && (
        <div className="row table-container">
          <table className="table mb-b">
            <thead>
              <tr>
                <th>Selected</th>
                <th>Business ID</th>
                <th>Business Name</th>
                <th>Business Email</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((item, index) => (
                <tr key={index}>
                  <td className="d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedCheckboxes[item._id] ? true : false}
                      onChange={(e) => saveSelectedData(item, e.target.checked)}
                    ></input>
                  </td>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-100 d-flex justify-content-end">
            <CustomPagination
              skip={filters.skip}
              totalData={totalBusiness}
              paginationUpdated={paginationUpdated}
            />
          </div>
        </div>
      )}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column justify-content-center align-items-center pb-4">
            <h3 className="text-center mb-4">
              Some error occurred. Please try again!
            </h3>
            <button className="btn btn-primary pl-4 pr-4" onClick={toggle}>
              Close
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Layout>
  );
};

export default App;
