/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';

import { PAGINATION_DATA_LIMIT } from '../constants';

const CustomPagination = ({ totalData, paginationUpdated, skip }) => {
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pagesParts, setPagesParts] = useState(1);
  const [currPagePart, setCurrPagePart] = useState(1);
  const [pageStartingPoint, setPageStartingPoint] = useState(1);

  const PARTS_PAGES_LIMIT = 5;
  const PAGINATION_BREAK_POINT = PAGINATION_DATA_LIMIT;

  useEffect(() => {
    if (PAGINATION_BREAK_POINT >= totalData) {
      setPages(1);
      setCurrPage(1);
    } else {
      const pages = Math.ceil(parseInt(totalData) / PAGINATION_BREAK_POINT);
      const pagesParts = Math.ceil(pages / PARTS_PAGES_LIMIT);
      setPages(pages);
      setPagesParts(pagesParts);

      if (currPage > pages) {
        updatePagePart(pagesParts);
        updatePage(pages);
      }
    }
  }, [totalData]);

  const updatePage = (pageNo) => {
    setCurrPage(pageNo);
    paginationUpdated((pageNo - 1) * PAGINATION_BREAK_POINT);
  };

  const updatePagePart = (partNo) => {
    setCurrPagePart(partNo);
    let startPoint = partNo;
    if (startPoint - 1 !== 0) {
      startPoint = startPoint - 1;
      startPoint = startPoint * 5;
      startPoint++;
    }
    setPageStartingPoint(startPoint);
    updatePage(startPoint);
  };

  const switchPage = (pageNo) => {
    if (pageNo < pageStartingPoint) {
      updatePagePart(currPagePart - 1);
    } else if (pageNo >= pageStartingPoint + 5) {
      updatePagePart(currPagePart + 1);
    }
    updatePage(pageNo);
  };

  useEffect(() => {
    if (skip === 0) {
      setCurrPage(1);
      updatePagePart(1);
    } else {
      setCurrPage(skip / PAGINATION_BREAK_POINT + 1);
    }
  }, [skip]);

  const renderPages = () => {
    let pag = [];
    for (
      let i = pageStartingPoint;
      i < pageStartingPoint + PARTS_PAGES_LIMIT && i <= pages;
      i++
    ) {
      pag.push(
        <li key={i} className={`page-item ${i === currPage ? 'active' : ''}`}>
          <a onClick={() => updatePage(i)} className="page-link" href="#">
            <span aria-hidden="true">{i}</span>
          </a>
        </li>
      );
    }

    return pag;
  };

  if (pages === 0) {
    return '';
  }
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination flex flex-row justify-content-end w-full">
        <li className={`page-item ${currPage === 1 ? 'disabled' : ''}`}>
          <a
            onClick={() => {
              updatePage(1);
              updatePagePart(1);
            }}
            className="page-link"
            href="#"
            aria-disabled={currPage === 1 ? 'true' : 'false'}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li className={`page-item ${currPage === 1 ? 'disabled' : ''}`}>
          <a
            onClick={() => switchPage(currPage - 1)}
            className="page-link"
            href="#"
            aria-disabled={currPage === 1 ? 'true' : 'false'}
          >
            <span aria-hidden="true">&lsaquo;</span>
          </a>
        </li>
        {currPagePart !== 1 && (
          <li className={`page-item`}>
            <a
              onClick={() => updatePagePart(currPagePart - 1)}
              className="page-link"
              href="#"
            >
              <span aria-hidden="true">...</span>
            </a>
          </li>
        )}
        {renderPages()}
        {currPagePart !== pagesParts && currPage !== pages && (
          <li className={`page-item`}>
            <a
              onClick={() => updatePagePart(currPagePart + 1)}
              className="page-link"
              href="#"
            >
              <span aria-hidden="true">...</span>
            </a>
          </li>
        )}
        <li className={`page-item ${currPage === pages ? 'disabled' : ''}`}>
          <a
            onClick={() => {
              switchPage(currPage + 1);
            }}
            className="page-link"
            href="#"
            aria-disabled={currPage === pages ? 'true' : 'false'}
          >
            <span aria-hidden="true">&rsaquo;</span>
          </a>
        </li>
        <li className={`page-item ${currPage === pages ? 'disabled' : ''}`}>
          <a
            onClick={() => {
              updatePagePart(pagesParts);
              updatePage(pages);
            }}
            className="page-link"
            href="#"
            aria-disabled={currPage === pages ? 'true' : 'false'}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default CustomPagination;
