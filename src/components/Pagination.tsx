import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Blog navigation">
      {pageNumbers.map((number) => (
        <a
          key={number}
          href="#"
          className={number === currentPage ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(number);
          }}
          aria-label={`Aller à la page ${number}`}
          aria-current={number === currentPage ? 'page' : undefined}
        >
          {number}
        </a>
      ))}
    </nav>
  );
};

export default Pagination;