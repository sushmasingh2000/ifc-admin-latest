import { HiX } from "react-icons/hi";
import axiosInstance from "../../../../config/axios";
import { API_URLS } from "../../../../config/APIUrls";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const WithdrawalModal = ({ open, setOpen }) => {
  const client = useQueryClient();

  const fk = useFormik({
    initialValues: {
      user_amount: "",
      wallet_address: "",
      wallet_type: "income_wallet"
    },
    onSubmit: async (values) => {
      if (!values.user_amount) {
        return toast.error("Package Amount are required");
      }
      try {
        const res = await axiosInstance.post(
          API_URLS.member_payout,
          values
        );

        toast.success(res?.data?.message);
        fk.resetForm();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Top-up failed");
      }
    },
  });
  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Withdrawal</h2>
          <button onClick={() => setOpen(false)}>
            <HiX size={22} />
          </button>
        </div>

        <div className="border rounded-lg px-4 py-3 mt-1 mb-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">USD (US Dollar)</span>
            <span className="text-slate-500"></span>
          </div>
        </div>
        <div>
          <FormControl>
            <RadioGroup
              row
              name="wallet_type"
              value={fk.values.wallet_type}
              onChange={fk.handleChange}
            >
              <FormControlLabel
                value="income_wallet"
                control={<Radio />}
                label="Income Wallet"
              />
              <FormControlLabel
                value="spot_wallet"
                control={<Radio />}
                label="Spot Wallet"
              />
            </RadioGroup>
          </FormControl>
        </div>
        {/* address */}
        <label className="text-sm text-slate-600">Address</label>
        <input
          type="text"
          placeholder="Enter Address"
          name="wallet_address"
          value={fk.values.wallet_address}
          onChange={fk.handleChange}
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#5e59eb]"
        />
        {/* Amount */}
        <label className="text-sm text-slate-600">Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          name="user_amount"
          value={fk.values.user_amount}
          onChange={fk.handleChange}
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#5e59eb]"
        />

        {/* Button */}
        <button onClick={fk.handleSubmit}
          className="w-full bg-[#5e59eb] text-white py-2 rounded-lg font-medium hover:opacity-90"
        >
          Withdraw funds
        </button>
      </div>
    </div>
  );
};

export default WithdrawalModal;
