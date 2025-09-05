import { useState, useEffect } from "react";

const Pagination = ({ 
  totalItems = 0, 
  itemsPerPage = 1, 
  currentPage = 1, 
  onPageChange,
  showInfo = true 
}) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (localCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(localCurrentPage * itemsPerPage, totalItems);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setLocalCurrentPage(pageNumber);
      if (onPageChange) {
        onPageChange(pageNumber);
      }
    }
  };

  const handlePrevPage = () => {
    if (localCurrentPage > 1) {
      handlePageClick(localCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (localCurrentPage < totalPages) {
      handlePageClick(localCurrentPage + 1);
    }
  };

  const renderPage = (pageNumber, isActive = false) => {
    const className = `size-40 flex-center rounded-full cursor-pointer transition-all ${
      isActive 
        ? "bg-dark-1 text-white" 
        : "hover:bg-light-3 text-dark-1"
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
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (localCurrentPage <= 3) {
        // Near start: show 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (localCurrentPage >= totalPages - 2) {
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
        for (let i = localCurrentPage - 1; i <= localCurrentPage + 1; i++) {
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
      return renderPage(pageNumber, pageNumber === localCurrentPage);
    });
  };

  // Don't render pagination if no items
  if (totalItems === 0) return null;

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        {/* Page Info */}
        {showInfo && (
          <div className="col-auto md:order-1">
            <div className="text-14 text-light-1">
              Showing {startItem}-{endItem} of {totalItems} items
            </div>
          </div>
        )}

        {/* Previous Button */}
        <div className="col-auto md:order-2">
          <button 
            className={`button size-40 rounded-full border-light transition-all ${
              localCurrentPage > 1 
                ? "bg-blue-1 text-white hover:bg-blue-2" 
                : "bg-light-3 text-light-1 cursor-not-allowed"
            }`}
            onClick={handlePrevPage}
            disabled={localCurrentPage <= 1}
          >
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        {/* Page Numbers */}
        <div className="col-md-auto md:order-4">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {renderPages()}
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            {renderPages()}
          </div>
        </div>

        {/* Next Button */}
        <div className="col-auto md:order-3">
          <button 
            className={`button size-40 rounded-full border-light transition-all ${
              localCurrentPage < totalPages 
                ? "bg-blue-1 text-white hover:bg-blue-2" 
                : "bg-light-3 text-light-1 cursor-not-allowed"
            }`}
            onClick={handleNextPage}
            disabled={localCurrentPage >= totalPages}
          >
            <i className="icon-chevron-right text-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
