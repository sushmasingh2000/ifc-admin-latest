import { People } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { API_URLS } from "../config/APIUrls";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const formatDate = (d) => d.toISOString().split("T")[0];
  const today = formatDate(new Date());
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("today");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const { isLoading, data: count_info, refetch } = useQuery(
    ["master_main_dashboard", activeFilter, startDate, endDate],
    () =>
      axiosInstance.post(API_URLS.master_main_dashboard, {
        f_type: activeFilter,
        start_date: startDate,
        end_date: endDate,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );
  const count_info_data = count_info?.data?.response || [];
  useEffect(() => {
    const zoneName = count_info?.data?.response?.[0]?.zone_name;
    if (zoneName) {
      localStorage.setItem("block", zoneName);
    }
  }, [count_info?.data?.response?.[0]?.zone_name]);


  useEffect(() => {
    if (activeFilter) {
      refetch();
    }
  }, [activeFilter, startDate, endDate]);


  return (
    <div className="p-5">
      {/* <div className="flex !text-sm flex-wrap gap-2 mb-5">
        {["all", "today", "yesterday", "this_month", "last_month"].map((f) => (
          <Button
            size="small"
            className=""
            key={f}
            variant={activeFilter === f ? "contained" : "outlined"}
            onClick={() => setActiveFilter(f)}
          >
            {f.replace("_", " ").toUpperCase()}
          </Button>
        ))}

        <TextField
          type="date"
          label="Start Date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setActiveFilter("date");
          }}
        />
        <TextField
          size="small"
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setActiveFilter("date");
          }}
        />

        <Button
          variant="contained"
          onClick={() => refetch()}
          disabled={!startDate || !endDate}
        >
          Fetch
        </Button>
      </div> */}

      {isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
        {count_info_data?.map((i) => (
          <div
            key={i.id}
            className="text-center bg-gray-300 bg-opacity-75 rounded-lg py-3 cursor-pointer hover:shadow-lg transition duration-200"
            onClick={() =>
              navigate("/dashboard", {
                state: {
                  zone_id: i.zone_id,
                  start_date: startDate,
                  end_date: endDate,
                },
              })
            }
          >
            <div className="text-lg pt-1 font-bold"><People className="!h-[3rem] !w-[3rem] !text-[#2a2785]" /></div>
            <p className="font-bold text-xs">{i.zone_name}</p>
            <p className="font-extrabold text-blue-700 text-lg">{i.present_emp}/{i.total_emp} </p>
            {/* <p className="font-extrabold text-black text-[9px]">Total No. of Pres./Total No. of Emp.  </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
