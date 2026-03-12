import { CardGiftcard, ColorizeRounded, Diversity1, Games, Home, PlayCircleFilledSharp, RowingSharp, SelfImprovement, SportsEsports } from '@mui/icons-material';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const user_type = localStorage.getItem("type")

export const all_Data = [
  {
    id: 1.0,
    navLink: '/admin_dashboard',
    navItem: 'Dashboard',
    navIcon: (
      <span>
        <Home color="#15317E" fontSize="medium" />
      </span>
    ),
  },
  {
    id: 3,
    navLink: "/player",
    navItem: "Member",
    navIcon: (
      <span>
        <SportsEsports color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 3.1,
        navLink: "/player",
        navItem: "All Memeber",
        navIcon: (
          <span>
            <Diversity1 color="#15317E" fontSize="medium" />
          </span>
        ),
      },
    ],
  },
  {
    id: 1,
    navLink: '/top_up_admin',
    navItem: 'TopUp',
    navIcon: (
      <span>
        <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
      </span>
    ),
  },
   {
    id: 1,
    navLink: '/wallet_update',
    navItem: 'Wallet Update',
    navIcon: (
      <span>
        <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
      </span>
    ),
  },
  
   {
    id: 11,
    navLink: '/reward_achiever',
    navItem: 'Reward Achievers',
    navIcon: (
      <span>
        <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
      </span>
    ),
  },
  // {
  //   id: 11,
  //   navLink: '/spot_wallet',
  //   navItem: 'Spot To Trade Deposit',
  //   navIcon: (
  //     <span>
  //       <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
  //     </span>
  //   ),
  // },
  //  {
  //   id: 11,
  //   navLink: '/profit_wallet',
  //   navItem: 'Profit To Trade Deposit',
  //   navIcon: (
  //     <span>
  //       <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
  //     </span>
  //   ),
  // },
    
  {
    id: 4,
    navLink: "/trade-p",
    navItem: "Income",
    navIcon: (
      <span>
        <CardGiftcard color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
  {
        id: 4.2,
        navLink: "/trade-p",
        navItem: "Trade Profit",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 4.1,
        navLink: "/direct-p",
        navItem: "Direct Partner Bonus",
        navIcon: (
          <span>
            <SelfImprovement color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 4.2,
        navLink: "/refer",
        navItem: "Referral Level Bonus",
        navIcon: (
          <span>
            <SelfImprovement color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 4.2,
        navLink: "/div",
        navItem: "Dividend Bonus",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 4.2,
        navLink: "/community-t",
        navItem: "Community Trade Bonus",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },

      {
        id: 4.2,
        navLink: "/rank-up-b",
        navItem: "Rank-Up Bonus",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 4.2,
        navLink: "/rank_rew",
        navItem: "Rank Reward",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
        {
        id: 4.2,
        navLink: "/same",
        navItem: "Same Rank Bonus",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
        {
        id: 4.2,
        navLink: "/partner",
        navItem: "Partner Rank Bonus",
        navIcon: (
          <span>
            <RowingSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
    ],
  },
  {
    id: 5,
    navLink: "/inr_Paying",
    navItem: "Transaction",
    navIcon: (
      <span>
        <Games color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 5.1,
        navLink: "/inr_Paying",
        navItem: " Trade Deposit",
        navIcon: (
          <span>
            <PlayCircleFilledSharp color="#15317E" fontSize="medium" />
          </span>
        ),
      },
      {
        id: 5.2,
        navLink: "/inr_Payout",
        navItem: " Payout",
        navIcon: (
          <span>
            <ColorizeRounded color="#15317E" fontSize="medium" />
          </span>
        ),
      },

    ],
  },

]
    
// ?.filter((i) => {
//   if (user_type === "Admin") return true;
//   if (user_type === "Zone Manager" || user_type === "Sub-Admin") {
//     return i?.navItem !== "Master" && i?.navItem !== "Send Notification";
//   }
//   return true;
// });

