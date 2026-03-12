import { useQuery } from "react-query";
import axiosInstance from "../../../config/axios";
import { API_URLS } from "../../../config/APIUrls";

const Income = () => {

  const { data: dashboard_data } = useQuery(
    ["dashboard_data"],
    () => axiosInstance.get(API_URLS?.member_dashboard
    ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );
  const member_dashboard = dashboard_data?.data?.result || []

  return (
    <div className="bg-white shadow p-4  mt-4 mb-10">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">
        Income Progress
      </h2>
      <p className="text-sm text-slate-500 max-w-2xl mb-6">
        Track your deposit income and referral earnings over time to better
        understand your performance.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Deposits Income */}
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from deposits
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.roi} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑  USD
            ({member_dashboard?.roi / member_dashboard?.total_income * 100} %)
           
          </div>
        </div>

        {/* Referral Income */}
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from referrals
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.direct} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑ 0 USD  ({member_dashboard?.direct / member_dashboard?.total_income * 100} %)

          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from Level
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.lev} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑ 0 USD  ({member_dashboard?.lev / member_dashboard?.total_income * 100} %)

          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from Reward
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.reward} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑ 0 USD  ({member_dashboard?.reward / member_dashboard?.total_income * 100} %)

          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from Rank
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.rnk} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑ 0 USD  ({member_dashboard?.rnk / member_dashboard?.total_income * 100} %)

          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-300 p-6">
          <p className="text-xs uppercase text-slate-400 mb-1">
            Income from Trade Profit (TP) Level
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {member_dashboard?.tp_lev} <span className="text-sm font-medium">USD</span>
          </h3>

          <div className="flex items-center gap-2 text-sm text-emerald-600 mt-2">
            ↑ 0 USD  ({member_dashboard?.tp_lev / member_dashboard?.total_income * 100} %)

          </div>
        </div>
      </div>

      {/* Total Income + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5">

        <div>
          <p className="uppercase text-xs text-slate-400">
            Total income
          </p>
          <h2 className="text-4xl font-bold text-slate-900">
            ${member_dashboard?.total_income}
          </h2>
        </div>

        {/* Filters */}
        {/* <div className="flex gap-2">
          <button style={{
            backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)"
          }} className="px-5 py-2 rounded-full  text-white text-sm font-medium">
            Week
          </button>
          <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">
            Month
          </button>
          <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">
            Year
          </button>
        </div> */}

      </div>

    </div>
  );
};

export default Income;
