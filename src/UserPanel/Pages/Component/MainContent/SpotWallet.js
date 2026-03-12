import { useFormik } from "formik";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URLS } from "../../../../config/APIUrls";
import axiosInstance from "../../../../config/axios";


const SpotModal = ({ open, setOpen, spotwallet }) => {
  const client = useQueryClient();

  const [loding, setLoding] = useState(false);
  const fk = useFormik({
    initialValues: {
      inr_value: "",
      m_pack_id: "",
    },
  });

  if (!open) return null;


  async function PayinZp() {
    const reqbody = {
      pkg_amount: Number(fk.values.inr_value),
    };
    try {
      const res = await axiosInstance.post(API_URLS?.activation_user,
        reqbody,
      );
      toast(res?.data?.message);
      if (res?.data?.success) {
        client.refetchQueries("dashboard")
        setOpen(false);
      }
      fk.handleReset();
      setLoding(false);
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg  text-center font-semibold">TopUp</h2>
          <button onClick={() => setOpen(false)}>
            <HiX size={22} />
          </button>
        </div>

        <label className="text-sm text-slate-600"> </label>
        <div className="border rounded-lg px-4 py-3 mt-1 mb-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">USD (US Dollar)</span>
            <span className="text-slate-500"></span>
          </div>
        </div>

        <label className="text-sm text-slate-600">Spot Wallet</label>
        <input
          type="number"
          value={spotwallet}
          onChange={fk.handleChange}
          disabled
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#5e59eb]"
        />
        <label className="text-sm text-slate-600">Trade Wallet</label>
        <input
          type="number"
          name="inr_value"
          value={fk.values.inr_value}
          onChange={fk.handleChange}
          placeholder="Enter amount"
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#5e59eb]"
        />

        <button
          onClick={PayinZp}
          disabled={loding}
          className="w-full bg-[#5e59eb] text-white py-2 rounded-lg font-medium hover:opacity-90 mb-4"
        >
          {loding ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SpotModal;
