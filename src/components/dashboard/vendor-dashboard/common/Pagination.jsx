import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const renderPage = (pageNumber, isActive = false) => {
    const className = `size-40 flex-center rounded-full cursor-pointer ${
      isActive ? "bg-dark-1 text-white" : ""
    }`;
    return (
      <div key={pageNumber} className="col-auto">
        <div className={className} onClick={() => handlePageClick(pageNumber)}>
          {pageNumber}
        </div>
      </div>
    );
  };

  const renderPages = () => {
    if (totalPages <= 6) {
      // Show all pages if 6 or fewer
      return Array.from({ length: totalPages }, (_, i) =>
        renderPage(i + 1, i + 1 === currentPage)
      );
    } else {
      const pages = [];
      // Always show first page
      pages.push(renderPage(1, currentPage === 1));

      let startPage, endPage;
      if (currentPage <= 3) {
        // Show first 5 pages, then ... last
        startPage = 2;
        endPage = 5;
        for (let i = startPage; i <= endPage; i++) {
          pages.push(renderPage(i, i === currentPage));
    }
        pages.push(
          <div key="ellipsis-end" className="col-auto">
            <div className="size-40 flex-center rounded-full">...</div>
          </div>
        );
        pages.push(renderPage(totalPages, currentPage === totalPages));
      } else if (currentPage >= totalPages - 2) {
        // Show first, ... last 5 pages
        pages.push(
          <div key="ellipsis-start" className="col-auto">
            <div className="size-40 flex-center rounded-full">...</div>
          </div>
        );
        startPage = totalPages - 4;
        endPage = totalPages;
        for (let i = startPage; i <= endPage; i++) {
          pages.push(renderPage(i, i === currentPage));
        }
      } else {
        // Show first, ... current-2, current-1, current, current+1, current+2, ... last
        pages.push(
          <div key="ellipsis-start" className="col-auto">
            <div className="size-40 flex-center rounded-full">...</div>
          </div>
        );
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(renderPage(i, i === currentPage));
        }
        pages.push(
          <div key="ellipsis-end" className="col-auto">
            <div className="size-40 flex-center rounded-full">...</div>
          </div>
        );
        pages.push(renderPage(totalPages, currentPage === totalPages));
      }
    return pages;
    }
  };

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-auto md:order-1">
          <button
            className="button -blue-1 size-40 rounded-full border-light"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {renderPages()}
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            {renderPages()}
          </div>
        </div>

        <div className="col-auto md:order-2">
          <button
            className="button -blue-1 size-40 rounded-full border-light"
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
