import { Group, Person } from "@mui/icons-material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { API_URLS } from "../config/APIUrls";
import axiosInstance from "../config/axios";

const Dashboard = () => {

  const { isLoading, data: dashboard_data } = useQuery(
    ["dashboard"],
    () => axiosInstance.get(API_URLS?.get_admin_dashboard),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );
  const dashboard_new_data = dashboard_data?.data?.result;


  const data = [
    {
      id: 13,
      item: "Active Member",
      icon: <Person className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />,
      count: Number(dashboard_new_data?.[0]?.active_member)?.toFixed(0) || 0,
    },
    {
      id: 13,
      item: "Total  Memeber",
      icon: <Group className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />,
      count: Number(dashboard_new_data?.[0]?.total_member)?.toFixed(0) || 0,
    },

    {
      id: 5,
      item: "Total Direct Spot Deposit ",
      icon: (
        <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
      count: Number(dashboard_new_data?.[0]?.SPOT_DEPOSIT)?.toFixed(2) || 0,
    },
    // blockchian spot depost
    {
      id: 5,
      item: "Total Spot To Trade",
      icon: (
        <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
        count: Number(
        (
          (dashboard_new_data?.[0]?.Spot_to_trade || 0) -
          (dashboard_new_data?.[0]?.PROMOTIONAL_BONUS || 0)
        ).toFixed(2)
      ),
    },
    {
      id: 5,
      item: "Total Profit To Trade",
      icon: (
        <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
      count: Number(dashboard_new_data?.[0]?.Profit_to_trade)?.toFixed(2) || 0,
    },
    {
      id: 11,
      item: "Total Direct Withdrawal",
      icon: <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />,
      count: Number(dashboard_new_data?.[0]?.total_withdrawal)?.toFixed(2) || 0,
    },
    // blockchain withdrawal
    {
      id: 5,
      item: "Total Trade Fund",
      icon: (
        <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
      count: Number(
        (
          (dashboard_new_data?.[0]?.FUND_DEPOSIT || 0) -
          (dashboard_new_data?.[0]?.PROMOTIONAL_BONUS || 0)
        ).toFixed(2)
      ),
    },
    {
      id: 5,
      item: "Promotional Bonus",
      icon: (
        <CurrencyExchangeIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
      count: Number(dashboard_new_data?.[0]?.PROMOTIONAL_BONUS)?.toFixed(2) || 0,
    },
    {
      id: 4,
      item: "Direct",
      icon: (
        <MonetizationOnIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />
      ),
      count: Number(dashboard_new_data?.[0]?.DIRECT)?.toFixed(2) || 0,
    },
    {
      id: 11,
      item: "LEVEL",
      icon: <MonetizationOnIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />,
      count: Number(dashboard_new_data?.[0]?.LEVEL)?.toFixed(2) || 0,
    },
    {
      id: 14,
      item: " ROI",
      icon: <MonetizationOnIcon className="!h-[5rem] !w-[5rem] !text-[#2a2785]" />,
      count: Number(dashboard_new_data?.[0]?.ROI)?.toFixed(2) || 0,
    },

  ];
  if (isLoading)
    return (
      <div className="w-[100%] h-[100%] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <div className="grid lg:!grid-cols-4 md:!grid-cols-3 sm:grid-cols-1 p-5 gap-[2%] gap-y-4 ">
        {data?.map((i, index) => {
          return (
            <div
              key={index}
              className="!text-center !bg-gray-400 !bg-opacity-20 !rounded-lg !py-5 !cursor-pointer "
            >
              <div className="!text-lg !font-bold">{i?.icon}</div>
              <p className="!font-bold text-black">{i?.item}</p>
              <p className="!font-extrabold !text-blue-700 !text-lg">
                {i?.count}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
