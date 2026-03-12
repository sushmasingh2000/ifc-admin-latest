import React from "react";
import { TextField, Button } from "@mui/material";
import { FilterAlt, FileDownload } from "@mui/icons-material";



const CustomFilter = ({ formik, onFilter, onClear, onExport }) => {


  return (
    <div className="flex lg:flex-row flex-col data_filter_box_2  gap-3 md:gap-3 px-2 py-1 md:py-3">
      
     <div className="flex gap-3">
       <div className="md:flex items-center frominput">
        <span className="text-xs text-center mr-3">From:</span>
        <TextField
        className=""
          size="small"
          fullWidth
          type="date"
          id="start_date"
          name="start_date"
          value={formik.values.start_date}
          onChange={formik.handleChange}
        />
      </div>

      <div className="md:flex items-center frominput">
        <span className="text-xs text-center mr-3">To:</span>
        <TextField
          size="small"
          fullWidth
          type="date"
          id="end_date"
          name="end_date"
          value={formik.values.end_date}
          onChange={formik.handleChange}
        />
      </div>
     </div>

      <div className="flex frominput">

        <TextField
        fullWidth
          size="small"
          type="search"
          id="search"
          name="search"
          placeholder="Search"
          value={formik.values.search}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex gap-2 filterbtn">
        <Button
          onClick={onFilter}
          variant="contained"
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>

        <Button
          onClick={onClear}
          variant="outlined"
          color="secondary"
        >
          Clear
        </Button>

        <Button
          onClick={onExport}
          variant="contained"
          color="success"
          startIcon={<FileDownload />}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default CustomFilter;
