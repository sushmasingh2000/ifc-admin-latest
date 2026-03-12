

import Dashboard from "../Pages/Dashboard";
import DirectBonus from "../Pages/genealogy/DirectBonus";
import LevelBonus from "../Pages/genealogy/LevelBonus";
import PromotionalBonus from "../Pages/genealogy/PromotionalBonus";
import RankBonus from "../Pages/genealogy/RankBonus";
import RankrEWARD from "../Pages/genealogy/RankReward";
import ROIBonus from "../Pages/genealogy/ROIBonus";
import SameRankBonus from "../Pages/genealogy/SameRankBonus";
import ProfitToTradeWalletHistory from "../Pages/genealogy/SpotToTrade";
import SpotWalletHistory from "../Pages/genealogy/SpotWallet";
import TPBonus from "../Pages/genealogy/TPBonus";
import WeeklyBonus from "../Pages/genealogy/Weekly";
import INRPaying from "../Pages/INRPayment/INRPaying";
import INRPayout from "../Pages/INRPayment/INRPayout";
import Player from "../Pages/player/Player";
import RewardAchieverBonus from "../Pages/player/RewardAchiever";
import AdminTopUp from "../Pages/Topup";
import WalletAddress from "../Pages/WalletAddressUpdate";

export const routes = [
  {
    id: 1,
    path: "/admin_dashboard",
    component: <Dashboard />,
    navItem: "Dashboard",
  },
  {
    id: 3,
    path: "/player",
    component: <Player />,
    navItem: "Member",
  },
  {
    id: 2,
    path: "/top_up_admin",
    component: <AdminTopUp />,
    navItem: "TopUp",
  },
   {
    id: 3,
    path: "/wallet_update",
    component: <WalletAddress />,
    navItem: "Wallet Update",
  },
  {
    id: 2,
    path: "/reward_achiever",
    component: <RewardAchieverBonus />,
    navItem: "Reward Achiever",
  },
  {
    id: 2,
    path: "/spot_wallet",
    component: <SpotWalletHistory />,
    navItem: "Spot  Wallet",
  },
   {
    id: 2,
    path: "/profit_wallet",
    component: <ProfitToTradeWalletHistory />,
    navItem: "Profit  Wallet",
  },

  {
    id: 3,
    path: "/inr_Paying",
    component: <INRPaying />,
    navItem: " Paying",
  },
  {
    id: 4,
    path: "/inr_Payout",
    component: <INRPayout />,
    navItem: " Payout",
  },
  {
    id: 116,
    path: "/refer",
    component: <LevelBonus />,
    navItem: "Referral Level Bonus",
  },
  {
    id: 116,
    path: "/direct-p",
    component: <DirectBonus />,
    navItem: " Direct Partner Bonus",
  },
  {
    id: 119,
    path: "/trade-p",
    component: <ROIBonus />,
    navItem: "Trade Profit",
  },
  {
    id: 119,
    path: "/community-t",
    component: <RankBonus />,
    navItem: "Rank Bonus",
  },
  {
    id: 119,
    path: "/div",
    component: <TPBonus />,
    navItem: "TP Level",
  },
  {
    id: 119,
    path: "/rank-up-b",
    component: <WeeklyBonus />,
    navItem: "Promotional Bonus",
  },
   {
    id: 119,
    path: "/partner",
    component: <PromotionalBonus />,
    navItem: "Promotional Bonus",
  },
  {
    id: 119,
    path: "/partner",
    component: <PromotionalBonus />,
    navItem: "Promotional Bonus",
  },
   {
    id: 120,
    path: "/rank_rew",
    component: <RankrEWARD />,
    navItem: "Promotional Bonus",
  },
    {
    id: 120,
    path: "/same",
    component: <SameRankBonus />,
    navItem: "Promotional Bonus",
  },
];