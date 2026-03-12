import { HiX } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ open, setOpen, setDepositeOpen , setWithdrawOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const item = (label, path, onClick) => {
    const active = location.pathname === path;

    return (
      <li
        className={`px-4 py-2 rounded-lg cursor-pointer transition
        ${active
            ? "bg-[#5e59eb] text-white"
            : "text-slate-600 hover:bg-teal-50 hover:text-[#5e59eb]"
          }`}
        onClick={() => {
          if (onClick) {
            onClick(); 
          } else {
            navigate(path); 
            setOpen(false); 
          }
        }}
      >
        {label}
      </li>
    );
  };


  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-slate-50  border-slate-200 px-6 py-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#5e59eb]">
            IFCTRADE
          </h1>

          <button
            className="md:hidden text-slate-600"
            onClick={() => setOpen(false)}
          >
            <HiX size={22} />
          </button>
        </div>

        <p className="uppercase text-xs tracking-wide text-slate-400 mb-3">
          Home
        </p>
        <ul className="space-y-2 mb-1">
          {item("Dashboard", "/dashboard")}
        </ul>
        <p className="uppercase text-xs tracking-wide text-slate-400 mb-3">
          Income
        </p>
         <ul className="">
          {item("Reward Achiever", "/reward")}
        </ul>
        <ul className="">
          {item("ROI Bonus", "/roi_user")}
        </ul>
          <ul className="">
          {item("LeveL Bonus", "/level_user")}
        </ul>
         <ul className="">
          {item("Direct Bonus", "/dir_user")}
        </ul>
         <ul className="">
          {item("Rank Bonus", "/rank_user")}
        </ul>
          <ul className="">
          {item("TP Level", "/tp_user")}
        </ul>
          <ul className="">
          {item("Promotional Bonus", "/pro_user")}
        </ul>
         
        <p className="uppercase text-xs tracking-wide text-slate-400 my-3">
          Financial
        </p>
        <ul className=" mb-3">
          {item("Spot Transaction", "/my_spot")}

          {item("Withdrawal", "/my_withdrawal")}
            {item("Open Withdraw", "/open-withdraw", () => {
            setWithdrawOpen(true);
            setOpen(false);
          })}
        </ul>

        <p className="uppercase text-xs tracking-wide text-slate-400 mb-3">
          Deposits
        </p>
        <ul className=" mb-8">
          {item("Open Deposit", "/open-deposit", () => {
            setDepositeOpen(true);
            setOpen(false);
          })}
          {item("My Deposits", "/my_deposits")}
        </ul>

        <p className="uppercase text-xs tracking-wide text-slate-400 mb-3">
          Account
        </p>
        <ul className="">
          {item("Profile", "/profile")}
          <li className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              navigate('/');
            }}>
            Log out
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
