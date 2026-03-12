import { CreditCard, Wallet } from "@mui/icons-material";
import { useState } from "react";
import { useQuery } from "react-query";
import { API_URLS } from "../../../config/APIUrls";
import axiosInstance from "../../../config/axios";
import SpotModal from "./MainContent/SpotWallet";
import CompundingModal from "./MainContent/CompundingWallet";

const DashboardCards = () => {
  const [spot, setSpot] = useState(false);
  const [compundingwallet, setCompounding] = useState(false);
  

  const { data: dashboard_data } = useQuery(
    ["dashboard"],
    () => axiosInstance.get(API_URLS?.member_details
    ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );
  const user = dashboard_data?.data?.result[0] || []

  const maxMembers = 100;
  const percentage = Math.min(
    (user?.tr03_dir_mem / maxMembers) * 100,
    100
  );


  const maxVolume = 1000;

  const personalVolume = Number(user?.tr03_fund_wallet || 0);

  const volumePercent = Math.min(
    (personalVolume / maxVolume) * 100,
    100
  );


  // if (!user) {
  //   return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  // }

  return (
    <>
      <SpotModal
        open={spot}
        setOpen={setSpot}
        spotwallet={user?.tr03_fund_wallet}
      />
      <CompundingModal
        open={compundingwallet}
        setOpen={setCompounding}
        setcompound={user?.tr03_inc_wallet}
      />
      
      <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <div className="flex gap-3 items-center mb-4">
            <div
              style={{
                backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)",
              }}
              className="w-14 h-14 text-white rounded-full flex items-center justify-center font-bold text-lg"
            >
              {user?.lgn_name?.charAt(0)}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {user?.lgn_name || "0"}
              </h3>
              <p className="text-sm text-[#5e59eb] flex gap-2 items-center">
                <img
                  className="h-5 w-5"
                  src="https://welbit.com/assets/img/rank/1.webp"
                  alt=""
                />
                Rank: {user?.rank_name || "--"}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Personal Volume
            <span className="block text-xl font-bold text-slate-800">
              $ {user?.tr03_fund_wallet}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 my-4">
            <div
              style={{
                backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)",
                width: `${volumePercent}%`,
              }}
              className="h-2 rounded-full"
            ></div>
          </div>
        </div>

        <div
          style={{
            backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)",
          }}
          className="text-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm opacity-80">Total Trade Profit</p>
          <h2 className="text-4xl font-bold mt-4">
            $ {user?.tr03_total_income}
          </h2>

          {/* <p className="text-emerald-300 text-sm mt-3">
            Active for income: {user?.tr03_active_for_inc ? "Yes" : "No"}
          </p> */}
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold mb-4">Balance Assets</h3>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400"> Profit Wallet</span>
            <span> <Wallet className="text-[#4a48b9]" onClick={() => setCompounding(true)}  /> ${user?.tr03_inc_wallet}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Spot Wallet</span>
            <span> <CreditCard className="text-[#4a48b9]" onClick={() => setSpot(true)} />  ${user?.tr03_fund_wallet}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Trade Wallet</span>
            <span>${user?.tr03_topup_wallet}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-md border">
        <h3 className="text-lg font-semibold text-slate-800">
          Referral Program
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Invite friends & earn commissions
        </p>

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500">Direct Members</p>
            <p className="font-semibold text-[#5e59eb]">
              {user?.tr03_dir_mem}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Team Business</p>
            <p className="font-semibold text-slate-800">
              $ {user?.tr03_team_buss}
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-slate-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
