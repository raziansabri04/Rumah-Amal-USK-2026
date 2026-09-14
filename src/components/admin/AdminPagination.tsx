'use client';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'data',
}: AdminPaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-gray-500 font-medium">
        Menampilkan <span className="font-bold text-gray-700">{startItem}-{endItem}</span> dari <span className="font-bold text-gray-700">{totalItems}</span> {itemLabel}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Prev */}
          {currentPage > 1 ? (
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              « Prev
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-300 text-xs font-bold rounded-lg cursor-not-allowed">
              « Prev
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === currentPage;
              const showPage =
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1;

              if (!showPage) {
                if (p === 2 && currentPage > 3) {
                  return (
                    <span key="ellipsis-start" className="text-xs text-gray-400 px-1 select-none">
                      ...
                    </span>
                  );
                }
                if (p === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <span key="ellipsis-end" className="text-xs text-gray-400 px-1 select-none">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#063A1E] text-white shadow-xs'
                      : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next */}
          {currentPage < totalPages ? (
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              Next »
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-300 text-xs font-bold rounded-lg cursor-not-allowed">
              Next »
            </span>
          )}
        </div>
      )}
    </div>
  );
}
