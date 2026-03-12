import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";
const CustomToPagination = ({ setPage, page, data, pageSize, setPageSize }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;
  return (
    <div className={`${setPageSize && "justify-between"} bg-custom-gradient w-full flex items-center justify-end  gap-4 p-3 rounded ` }>
      {setPageSize &&
        <div className="flex gap-2 items-center justify-end ">
          <p className="font-semibold lg:text-xl text-xs text-text-color">Page Count : </p>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-400 px-2 py-1 rounded text-text-color lg:text-xl text-xs"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </div>

      }

      <div className="flex gap-5">
        <span className="font-semibold lg:text-xl text-xs text-text-color">
          Total Pages: <span className="text-text-color lg:text-xl text-xs ">{totalPages}</span>
        </span>
        <span className=" font-semibold text-text-color lg:text-xl text-xs ">
          Current Page: <span className="text-text-color lg:text-xl text-xs ">{currentPage}</span>
        </span>

        <IconButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`transition-transform duration-200 rounded-full ${page <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
            }`}
        >
          <ChevronLeftIcon className="text-text-color" />
        </IconButton>

        <IconButton
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`transition-transform duration-200 rounded-full ${page >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
            }`}
        >
          <ChevronRightIcon className="text-text-color" />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomToPagination;
