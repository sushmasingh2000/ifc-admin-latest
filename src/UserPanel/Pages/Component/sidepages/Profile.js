import { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axios";
import { API_URLS } from "../../../../config/APIUrls";

const Profile = () => {
  const [data, setData] = useState([]);

  const userListFunction = async () => {
    try {
      const res = await axiosInstance.get(API_URLS?.member_details);
      setData(res.data.result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    userListFunction();
  }, []);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 p-6">Loading profile...</p>;
  }

  const user = data[0];

  return (
    <div className="max-w-5xl mx-auto">

      {/* 🔥 Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-indigo-600 flex items-center justify-center text-3xl font-bold shadow">
            {user?.lgn_name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.lgn_name}</h2>
            <p className="text-sm opacity-90">{user.lgn_email}</p>
            <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-xs">
              Customer ID: {user.tr03_cust_id}
            </span>
          </div>
        </div>
      </div>

      {/* 💰 Wallet Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Income Wallet</p>
          <h3 className="text-2xl font-bold text-green-600">
            ₹ {user.tr03_inc_wallet}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Fund Wallet</p>
          <h3 className="text-2xl font-bold text-blue-600">
            ₹ {user.tr03_fund_wallet}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Topup Wallet</p>
          <h3 className="text-2xl font-bold text-purple-600">
            ₹ {user.tr03_topup_wallet}
          </h3>
        </div>
      </div>

      {/* 📋 Details Section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          Account Details
        </h3>

        <div className="grid md:grid-cols-2 gap-5 text-sm">
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-medium">{user.lgn_mobile}</p>
          </div>

          <div>
            <p className="text-gray-500">Sponsor</p>
            <p className="font-medium">
              {user.spon_name} ({user.spon_id})
            </p>
          </div>

          <div>
            <p className="text-gray-500">Rank</p>
            <p className="font-medium">{user.tr03_rank}</p>
          </div>

          <div>
            <p className="text-gray-500">Registration Date</p>
            <p className="font-medium">
              {new Date(user.tr03_reg_date).toLocaleDateString()}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500">Profit</p>
            <p className="font-semibold text-green-600">
              ₹ {user.profit}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
