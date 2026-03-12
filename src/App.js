import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLogIn from "./Authentication/Login";
import LogIn from "./UserPanel/Authentication/Login";
import SignUp from "./UserPanel/Authentication/SignUp";
import Dashboard from "./UserPanel/Pages/Component/MainContent/Dashboard";
import ROIBonus from "./UserPanel/Pages/Component/sidepages/ROIIncome";
import LevelBonus from "./UserPanel/Pages/Component/sidepages/LevelIncome";
import TpBonus from "./UserPanel/Pages/Component/sidepages/TpIncome";
import PromotionalBonus from "./UserPanel/Pages/Component/sidepages/Promotionalincome";
import DirectBonus from "./UserPanel/Pages/Component/sidepages/DirectIncome";
import Layout from "./Layout";
import DashboardLayout from "./UserPanel/Pages/Component/Topbar/Layout";
import { routes } from "./Routes";
import Deposithistory from "./UserPanel/Pages/Component/sidepages/DepositeHistory";
import WithdrawHistory from "./UserPanel/Pages/Component/sidepages/WithdrawHistory";
import Profile from "./UserPanel/Pages/Component/sidepages/Profile";
import RankBonus from "./UserPanel/Pages/Component/sidepages/RankIncome";
import RewardBonus from "./UserPanel/Pages/Component/sidepages/Reward";
import SpotHistory from "./UserPanel/Pages/Component/sidepages/SpotHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/Auth routes */}
        {/* <Route path="/" element={<LogIn />} /> */}
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/" element={<AdminLogIn />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
         <Route
          path="/reward"
          element={
            <DashboardLayout>
              <RewardBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/roi_user"
          element={
            <DashboardLayout>
              <ROIBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/level_user"
          element={
            <DashboardLayout>
              <LevelBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/tp_user"
          element={
            <DashboardLayout>
              <TpBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/pro_user"
          element={
            <DashboardLayout>
              <PromotionalBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/dir_user"
          element={
            <DashboardLayout>
              <DirectBonus />
            </DashboardLayout>
          }
        />
         <Route
          path="/rank_user"
          element={
            <DashboardLayout>
              <RankBonus />
            </DashboardLayout>
          }
        />
        <Route
          path="/my_deposits"
          element={
            <DashboardLayout>
              <Deposithistory />
            </DashboardLayout>
          }
        />
        <Route
          path="/my_withdrawal"
          element={
            <DashboardLayout>
              <WithdrawHistory />
            </DashboardLayout>
          }
        />
         <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
            <Route
          path="/my_spot"
          element={
            <DashboardLayout>
              <SpotHistory />
            </DashboardLayout>
          }
        />
        

        {/* Dynamic routes from routes array */}
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <Layout
                id={route.id}
                navLink={route.path}
                navItem={route.navItem}
                component={route.component}
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
