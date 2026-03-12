import { Notifications } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { API_URLS } from "../../../../config/APIUrls";
import axiosInstance from "../../../../config/axios";

const Topbar = ({ setOpen }) => {

  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const res = await axiosInstance.get(API_URLS?.member_details);
      setUser(res.data.result[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white md:px-6 shadow-sm sticky top-0 z-30">

      {/* Left Title */}
      <h1 className="md:hidden text-lg font-semibold text-[#5e59eb]">
        IFC Trade
      </h1>
      <h1 className="hidden md:block text-lg font-semibold text-black">
        Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex gap-4 items-center">
        <Notifications className="!text-gray-500" />

        {/* Mobile Menu */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setOpen(true)}
        >
          <HiMenuAlt2 size={26} />
        </button>

        {/* Desktop Avatar */}
        <div className="hidden md:flex w-9 h-9 bg-[#5e59eb] text-white rounded-full items-center justify-center font-semibold">
          {user?.lgn_name?.charAt(0)}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
