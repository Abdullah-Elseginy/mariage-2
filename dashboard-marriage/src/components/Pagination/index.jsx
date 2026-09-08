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

  const PageArrow = ({ children, disabled, onClick, title, className = '' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#344458] dark:bg-[#101923] dark:text-slate-200 dark:hover:border-gold dark:hover:text-white ${className}`}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  return (
    <nav className={`mt-5 ${className}`} aria-label="Pagination">
      <div className="flex items-center justify-center gap-3 sm:hidden">
        <PageArrow onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} title="Previous page"><FiChevronLeft /></PageArrow>
        <span className="min-w-24 text-center text-sm font-bold text-slate-600 dark:text-slate-300">{currentPage} / {totalPages}</span>
        <PageArrow onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Next page"><FiChevronRight /></PageArrow>
      </div>
      <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
        <PageArrow onClick={() => onPageChange(1)} disabled={currentPage === 1} title="First page"><FiChevronsLeft /></PageArrow>
        <PageArrow onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} title="Previous page"><FiChevronLeft /></PageArrow>
        <div className="flex flex-wrap items-center justify-center gap-1">
        {getPageNumbers().map((page, index) => page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-slate-400 dark:text-slate-500">...</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold transition ${currentPage === page ? 'border-[#111820] bg-[#111820] text-white shadow-lg dark:border-gold dark:bg-gold dark:text-[#111820]' : 'border-slate-200 bg-white text-slate-600 hover:border-gold hover:text-slate-950 dark:border-[#344458] dark:bg-[#101923] dark:text-slate-200 dark:hover:border-gold dark:hover:text-white'}`}
          >
            {page}
          </button>
        ))}
        </div>
        <PageArrow onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Next page"><FiChevronRight /></PageArrow>
        <PageArrow onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} title="Last page"><FiChevronsRight /></PageArrow>
      </div>
    </nav>
  );
};

export default Pagination;
