import { FilterAlt } from '@mui/icons-material';
import { Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomToPagination from '../../Shared/CustomPagination';
import CustomTable from '../../Shared/CustomTable';
import { API_URLS, front_end_domain, frontend } from '../../config/APIUrls';
import axiosInstance from '../../config/axios';

const Player = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loding, setloding] = useState(false);
  const [page, setPage] = useState(1);
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    wallet: "",
    password: "",
  });

  const userListFunction = async () => {
    setloding(true);
    try {
      const res = await axiosInstance.post(API_URLS?.member_details_admin, {
        search: search,
        page: page,
        start_date: from_date,
        end_date: to_date,
      });
      setData(res.data.result);
    } catch (e) {
      console.log(e);
    }
    setloding(false);
  };

  useEffect(() => {
    userListFunction();
  }, [page]);
  const formatMobile = (number) => {
    if (!number) return "--";
    // Remove extra spaces
    const clean = number.replace(/\s+/g, '');
    // Format Indian number like +91 12345 67890
    if (clean.startsWith('+91') && clean.length === 13) {
      return clean.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
    }
    return number;
  };

  const tablehead = [
    <span>S.No</span>,
    <span>Customer ID</span>,
    <span>Action</span>,
    <span>Name</span>,
    <span>Email</span>,
    <span>Mobile No.</span>,
    <span>Password</span>,
    <span>Spot Wallet</span>,
    <span>Trade Wallet</span>,
    <span>Total Income</span>,
    <span>Direct Members</span>,
    <span>Team Members</span>,
    <span>Rank</span>,
    <span>Wallet Address</span>,
    <span>Registration Date</span>,
    <span>TopUp Date</span>,
  ];

  const tablerow = data?.data?.map((i, index) => {
    return [
      <span>{(page - 1) * 10 + index + 1}</span>, 
      <span className={`${i?.lgn_token ? "!text-blue-600 underline cursor-pointer" : "!text-black"}`}
        onClick={() => {
          // localStorage.setItem("token", i.lgn_token);
          // localStorage.setItem("login_user", "User");
          window.open(frontend + "/user-login?token="+i.lgn_token+"&login_user="+"User", "_blank");
        }}
         >{i.tr03_cust_id || "--"}</span>,
      <span><Button variant='contained' onClick={() => {
        setSelectedUser(i);
        setFormData({
          name: i.lgn_name || "",
          email: i.lgn_email || "",
          mobile: i.lgn_mobile || "",
          wallet: i.lgn_wallet_add || "",
          password: i.lgn_pass || "",
        });
        setOpenModal(true);
      }} >Edit </Button></span>,
      <span>{i.lgn_name || "--"}</span>,
      <span>{i.lgn_email || "--"}</span>,
      <span style={{ whiteSpace: 'nowrap' }}>
        {formatMobile(i.lgn_mobile)}
      </span>,
      <span>{i.lgn_pass || "--"}</span>,
      <span className='text-blue-600'>{Number(i.tr03_fund_wallet || 0).toFixed(2)}</span>,
      <span className='text-blue-600'>{Number(i.tr03_topup_wallet || 0).toFixed(2)}</span>,
      <span className='text-blue-600'>{Number(i.tr03_total_income || 0).toFixed(2)}</span>,
      <span>{i.tr03_dir_mem || 0}</span>,
      <span>{i.tr03_team_mem || 0}</span>,
      <span>{i.tr03_rank || "--"}</span>,
      <span>{i?.lgn_wallet_add
        ? `${i.lgn_wallet_add.slice(0, 14)}...${i.lgn_wallet_add.slice(-4)}`
        : "--"}</span>,
      <span>{i.tr03_reg_date ? moment(i.tr03_reg_date)?.format("DD-MM-YYYY") : "--"}</span>,
      <span>{i.tr03_topup_date ? moment(i.tr03_topup_date)?.format("DD-MM-YYYY") : "--"}</span>
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
          size="small"
        />
        <span className="font-bold">To:</span>
        <TextField
          type="date"
          value={to_date}
          onChange={(e) => setTo_date(e.target.value)}
          size="small"
        />
        <TextField
          type="search"
          placeholder="Search by user id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />

        <Button
          onClick={() => {
            setPage(1);
            userListFunction();
          }}
          variant="contained"
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>
      </div>
      <CustomTable
        tablehead={tablehead}
        tablerow={tablerow}
        isLoading={loding}
      />
      <CustomToPagination setPage={setPage} page={page} data={data} />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-details"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
        }}>
          <h2>Update User details</h2>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Mobile"
            fullWidth
            margin="normal"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          {/* <TextField
            label="Wallet Address"
            fullWidth
            margin="normal"
            value={formData.wallet}
            onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
          /> */}
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={async () => {
              setOpenModal(false);
              const result = await Swal.fire({
                title: "Are you sure?",
                text: "You want to update this user details!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                buttonsStyling: false,
                customClass: {
                  confirmButton: "swal-confirm-btn",
                  cancelButton: "swal-cancel-btn"
                }
              });
              if (result.isConfirmed) {
                try {
                  let cleanedMobile = formData.mobile
                    ?.trim()
                    .replace(/\s+/g, "")
                    .replace(/^\+91/, "");

                  const res = await axiosInstance.post(API_URLS.change_member_profile, {
                    customer_id: selectedUser.tr03_cust_id,
                    name: formData.name?.trim(),
                    email: formData.email?.trim(),
                    mobile: cleanedMobile,
                    wallet_address: formData.wallet?.trim(),
                    password: formData.password
                  });

                  if (res?.data?.success) {
                    Swal.fire({
                      title: "Updated!",
                      text: res?.data?.message,
                      icon: "success",
                      confirmButtonText: "OK",
                      buttonsStyling: false,
                      customClass: {
                        confirmButton: "swal-confirm-btn"
                      }
                    });
                    setOpenModal(false);
                    userListFunction();
                  } else {
                    Swal.fire("Error", res?.data?.message || "Update failed", "error");
                  }
                } catch (err) {
                  console.log(err);
                  Swal.fire("Error", "Something went wrong", "error");
                }
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div >
  );
};

export default Player;


