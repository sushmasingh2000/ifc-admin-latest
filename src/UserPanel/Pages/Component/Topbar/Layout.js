import { useState } from "react";
import Sidebar from "../MainContent/Sidebar";
import Topbar from "../MainContent/Topbar";
import DepositeModal from "../sidepages/Deposite";
import WithdrawalModal from "../sidepages/Withdrawal";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [depositeOpen, setDepositeOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="flex w-full ">

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          setDepositeOpen={setDepositeOpen}
          setWithdrawOpen={setWithdrawOpen}
        />

        {/* Deposit Modal */}
        <DepositeModal
          open={depositeOpen}
          setOpen={setDepositeOpen}
        />

         <WithdrawalModal
          open={withdrawOpen}
          setOpen={setWithdrawOpen}
        />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-slate-50 ">
          <Topbar setOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
