import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomToPagination from "../../Shared/CustomPagination";
import CustomTable from "../../Shared/CustomTable";

const INRPaying = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [totalamount, setTotalamount] = useState([]);
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [loding, setloding] = useState(false);
  const [page, setPage] = useState(1);

  const INRPayingFunction = async () => {
    setloding(true);
    try {
      const res = await axiosInstance.post(API_URLS?.get_report_details, {
        start_date: from_date,
        end_date: to_date,
        username: search,
        page: page,
        count: 10,
        sub_label: "FUND DEPOSIT",
        main_label: "IN",
      });
      setData(res?.data?.result || []);
      setTotalamount(res?.data?.total);

      if (res) {
        setTo_date("");
        setFrom_date("");
      }
    } catch (e) {
      console.log(e);
    }
    setloding(false);
  };

  useEffect(() => {
    INRPayingFunction();
  }, [page]);


  const tablehead = [
    <span>S.No</span>,
    <span>User ID</span>,
    <span>Name</span>,
    <span>Amount</span>,
    <span>Status</span>,
    <span>Transaction ID</span>,
    <span>Date</span>,
  ];

  const tablerow = data?.data?.map((i, index) => [
    <span>{index + 1}</span>,
    <span>{i?.tr03_cust_id}</span>,
    <span>{i?.lgn_name || "N/A"}</span>,
    <span>{Number(i?.tr07_tr_amount).toFixed(2)}</span>,
    <span>{i?.tr09_roi_status}</span>,
    <span>{i?.tr07_trans_id}</span>,
    <span>{moment(i?.tr07_created_at).format("DD-MM-YYYY HH:mm:ss")}</span>,
  ]);

  return (
    <div>
      <div className="flex bg-white my-2 px-2 gap-5 !justify-start py-2">
        <span className="font-bold">From:</span>
        <TextField
          type="date"
          value={from_date}
          onChange={(e) => setFrom_date(e.target.value)}
        />
        <span className="font-bold">To:</span>
        <TextField
          type="date"
          value={to_date}
          onChange={(e) => setTo_date(e.target.value)}
        />
        <TextField
          type="search"
          placeholder="Search by user id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => INRPayingFunction()}
          variant="contained"
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>
      </div>
      <CustomTable
        isTotal={
          <div className="bg-white my-2 p-2 px-5 !text-right">
            Total Amount : <span className="!font-bold">{totalamount}</span>
          </div>
        }
        tablehead={tablehead}
        tablerow={tablerow}
        isLoading={loding}
      />
      <CustomToPagination page={page} setPage={setPage} data={data} />

    </div>
  );
};

export default INRPaying;
