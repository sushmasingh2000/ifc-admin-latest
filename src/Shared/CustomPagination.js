import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";

const CustomToPagination = ({ setPage, page, data }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;
  return (
    <div className="bg-custom-gradient w-full flex items-center justify-end gap-4 p-3 rounded ">
      <span className=" font-semibold text-text-color">
        Total Pages: <span className="text-text-colo">{totalPages}</span>
      </span>
      <span className=" font-semibold text-text-color">
        Current Page: <span className="text-text-color">{currentPage}</span>
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
  );
};

export default CustomToPagination;
