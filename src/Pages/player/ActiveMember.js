import { Edit, FilterAlt } from '@mui/icons-material';
import { Button, MenuItem, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../Shared/CustomTable';
import CustomToPagination from '../../Shared/CustomPagination';
import axiosInstance from '../../config/axios';
import { API_URLS, front_end_domain, frontend } from '../../config/APIUrls';
import moment from 'moment';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { enCryptData } from '../../config/Secret';

const ActiveMember = () => {
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
        count: 1000000
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
    <span>Name</span>,
    <span>Email</span>,
    <span>Mobile No.</span>,
    <span>Password</span>,
    <span>Registration Date</span>,
    <span>TopUp Date</span>,
  ];

  const tablerow = data?.data?.filter((i) => i.tr03_topup_date)?.map((i, index) => {
    return [
      <span>{index + 1}</span>, 
      <span className="text-black"  >{i.tr03_cust_id || "--"}</span>,
      <span>{i.lgn_name || "--"}</span>,
      <span>{i.lgn_email || "--"}</span>,
      <span style={{ whiteSpace: 'nowrap' }}>
        {formatMobile(i.lgn_mobile)}
      </span>,
      <span>{i.lgn_pass || "--"}</span>,
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

export default ActiveMember;


