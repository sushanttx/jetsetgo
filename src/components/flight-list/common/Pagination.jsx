import { useState } from "react";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems/itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const handlePageClick = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    onPageChange(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-3, last-2, last-1, last
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((pageNumber, index) => {
      if (pageNumber === '...') {
        return (
          <div key={`ellipsis-${index}`} className="col-auto">
            <div className="size-40 flex-center rounded-full text-light-1">...</div>
          </div>
        );
      }
      
      return (
        <div key={pageNumber} className="col-auto">
          <div
            className={`size-40 flex-center rounded-full cursor-pointer transition-all ${
              currentPage === pageNumber 
                ? "bg-dark-1 text-white" 
                : "hover:bg-light-3 text-dark-1"
            }`}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </div>
        </div>
      );
    });
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-auto md:order-1">
          <button className="button -blue-1 size-40 rounded-full border-light" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {renderPageNumbers()}
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            {renderPageNumbers()}
          </div>

          <div className="text-center mt-30 md:mt-10">
            <div className="text-14 text-light-1">
              {startItem} - {endItem} of {totalItems} flights found
            </div>
          </div>
        </div>

        <div className="col-auto md:order-2">
          <button className="button -blue-1 size-40 rounded-full border-light"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          >
            <i className="icon-chevron-right text-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
