import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let page = 1; page <= totalPages; page += 1) pages.push(page);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...');
      for (let page = totalPages - 3; page <= totalPages; page += 1) pages.push(page);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const PageArrow = ({ children, disabled, onClick, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/20 bg-[#191520] text-gold transition hover:bg-gold hover:text-[#0b0a10] disabled:cursor-not-allowed disabled:opacity-40"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  return (
    <nav className={`mt-5 flex flex-wrap items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <PageArrow onClick={() => onPageChange(1)} disabled={currentPage === 1} title="First page"><FiChevronsLeft /></PageArrow>
      <PageArrow onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} title="Previous page"><FiChevronLeft /></PageArrow>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {getPageNumbers().map((page, index) => page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-[#F7EBD2]/40">...</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold transition ${currentPage === page ? 'border-gold bg-gold text-[#0b0a10] shadow-lg' : 'border-gold/20 bg-[#191520] text-gold hover:bg-gold hover:text-[#0b0a10]'}`}
          >
            {page}
          </button>
        ))}
      </div>
      <PageArrow onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Next page"><FiChevronRight /></PageArrow>
      <PageArrow onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} title="Last page"><FiChevronsRight /></PageArrow>
    </nav>
  );
};

export default Pagination;
