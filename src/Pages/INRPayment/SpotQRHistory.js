import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomToPagination from "../../Shared/CustomPagination";
import CustomTable from "../../Shared/CustomTable";

const SpotQrHistory = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [totalamount, setTotalamount] = useState([]);
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [loding, setloding] = useState(false);
  const [page, setPage] = useState(1);

  const SpotQrHistoryFunction = async () => {
    setloding(true);
    try {
      const res = await axiosInstance.post(API_URLS?.get_spot_deposit_details, {
        start_date: from_date,
        end_date: to_date,
        search: search,
        page: page,
        count: 10,
       
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
    SpotQrHistoryFunction();
  }, [page]);


  const tablehead = [
     "S.No",
     "User ID",
     "User Name",
     "User Email",
     "Transaction ID",
     "Amount",
     "Wallet Address",
     "UTR / Hash",
     "Date",
   ];
 
 
   const tablerow = data?.data?.map((i, index) => {
     return [
       <span>{index + 1}</span>,
       <span>{i?.lgn_cust_id}</span>,
       <span>{i?.lgn_name}</span>,
       <span>{i?.lgn_email}</span>,
       <span>{i?.tr_trans_id}</span>,
       <span>{i?.tr_amount}</span>,
        <span className="">{i?.tr_from_wallet}</span>,
       <span className="">{i?.tr_hex_code || "--"}</span>,
       <span>
         {moment(i?.tr_req_date).format("DD-MM-YYYY HH:mm:ss")}
       </span>,
     ];
   });

  return (
    <div>
      <p className="text-xl font-bold mb-3 px-5"> Spot Deposit History</p>
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
          onClick={() => SpotQrHistoryFunction()}
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

export default SpotQrHistory;
