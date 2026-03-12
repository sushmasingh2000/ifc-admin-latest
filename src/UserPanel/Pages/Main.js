import DashboardCards from "./Component/Card";
import Income from "./Component/Income";

const Main = () => {
  return (
    <div className="relative lg:mt-2 mt-5 overflow-visible rounded-3xl">

      <div style={{
        backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)"
      }} className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"></div>

      <div className="relative bg-slate-50 p-4 md:p-6 rounded-3xl overflow-hidden">
        <DashboardCards />
        <Income />
      </div>

    </div>
  );
};

export default Main;
