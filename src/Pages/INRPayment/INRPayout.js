import { FilterAlt, Lock } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SweetAlert from "sweetalert2";
import CustomToPagination from "../../Shared/CustomPagination";
import CustomTable from "../../Shared/CustomTable";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";



const INRPayout = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [totalamount, setTotalamount] = useState([]);
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [loding, setloding] = useState(false);
  const [page, setPage] = useState(1);

  const INRPayoutFunction = async () => {
    setloding(true);
    try {
      const res = await axiosInstance.post(API_URLS?.admin_member_payout, {
        start_date: from_date,
        end_date: to_date,
        username: search,
        page: page,
        count: 10,
        status: null,
      });
      setData(res?.data?.result || []);
      setTotalamount(res?.data?.total)
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
    INRPayoutFunction()
  }, [page])


  const changeStatusApprovedFunction = async (id) => {
    setloding(true);
    try {
      const reqbody = {
        t_id: id,
        status_type:"Success"
      }
      const res = await axiosInstance.post(API_URLS?.admin_withdrawal_approve, reqbody);
      if (res) {
        setTimeout(() => {
          INRPayoutFunction()
        }, 4000);
      }
      toast(res?.data?.msg);
    } catch (e) {
      console.log(e);
      toast("something went wrong")
    }
    setloding(false);

  };
  const handleSubmit = (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You want to Approve this Amount!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        changeStatusApprovedFunction(id);
      }
    });
  };
  useEffect(() => {
    INRPayoutFunction();
  }, []);

  const changeStatusRejectFunction = async (id) => {
    try {
      const reqbody = {
        t_id: id,
        status_type: "Reject"
      }
      const res = await axiosInstance.post(API_URLS?.admin_withdrawal_approve, reqbody);
      if (res) INRPayoutFunction();
      toast(res?.data?.msg);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmitReject = (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You want to Reject this Amount!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm",
        cancelButton: "custom-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        changeStatusRejectFunction(id);
      }
    });
  };

  const tablehead = [
    "S.No",
    "User ID",
    "User Name",
    "Transaction ID",
    "Amount",
    "Charges",
    "Net Amont",
    "Wallet Address",
    "Status",
    "UTR / Hash",
    "Wallet Type",
    "Date",
    "Action",
  ];


  const tablerow = data?.data?.map((i, index) => {
    return [
      <span>{index + 1}</span>,
      <span>{i?.tr03_cust_id}</span>,
      <span>{i?.lgn_name}</span>,
      <span>{i?.tr11_transacton_id}</span>,
      <span>{i?.tr11_amont}</span>,
      <span>{i?.tr11_charges}</span>,
      <span>{i?.tr11_net_amnt}</span>,
      <span>{i?.tr11_payout_to}</span>,
      <span>{i?.tr11_status}</span>,
      <span className="">{i?.payout_hash || "--"}</span>,
      <span className="">{i?.tr11_wallet_type}</span>,
      <span>
        {moment(i?.tr11_created_at).format("DD-MM-YYYY HH:mm:ss")}
      </span>,
      <span>
        {i?.tr11_status === "Pending" ? (
          <div className="!flex justify-center gap-2">
            <Button
              variant="contained"
              className="!bg-[#198754]"
              onClick={() => handleSubmit(i?.tr11_id)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              className="!bg-rose-800"
              onClick={() => handleSubmitReject(i?.tr11_id)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <Lock />
        )}
      </span>,
    ];
  });


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
          onClick={() => INRPayoutFunction()}
          variant="contained"
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>
      </div>
      <CustomTable
        isTotal={<div className="bg-white my-2 p-2 px-5 !text-right">Total Amount : <span className="!font-bold">{totalamount}</span></div>}
        tablehead={tablehead}
        tablerow={tablerow}
        isLoading={loding}
      />
      <CustomToPagination data={data} page={page} setPage={setPage} />
    </div>
  );
};

export default INRPayout;
