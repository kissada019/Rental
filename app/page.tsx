"use client";

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RentalContract {
  id: number;
  customerName: string;
  startDate: string;
  endDate: string;
}

interface CarData {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  rentalContractId: number;
  rentalContract: RentalContract;
}

export default function Page() {
  const [data, setData] = useState<CarData[]>([]);
  const [searchName, setSearchName] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [filteredData, setFilteredData] = useState<CarData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://localhost:7258/api/Vehicles/GetAll');
        const jsonData = await response.json();
        setData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = data.filter((item) =>
      item.rentalContract.customerName.toLowerCase().includes(searchName.toLowerCase())
    );

    if (startDateFilter) {
      result = result.filter((item) => item.rentalContract.startDate >= startDateFilter);
    }

    if (endDateFilter) {
      result = result.filter((item) => item.rentalContract.endDate <= endDateFilter);
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchName, startDateFilter, endDateFilter, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <div className="mb-3">
        <label>Customer Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search Customer Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Start Date:</label>
        <input
          type="date"
          className="form-control"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
          />
      </div>
      <div className="mb-3">
        <label>End Date:</label>
        <input
          type="date"
          className="form-control"
          value={endDateFilter}
          onChange={(e) => setEndDateFilter(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>License Plate</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Customer Name</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.licensePlate}</td>
              <td>{v.brand}</td>
              <td>{v.model}</td>
              <td>{v.rentalContract.customerName}</td>
              <td>{formatDate(v.rentalContract.startDate)}</td>
              <td>{formatDate(v.rentalContract.endDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}