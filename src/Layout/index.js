import { useMediaQuery } from 'react-responsive';
import Sidebar from '../Shared/Sidebar';
import MobileNavigation from '../Shared/Sidebar/MobileNavigation';

const Layout = ({ component }) => {
  const isMediumScreen = useMediaQuery({ maxWidth: 1000 });
  const type = localStorage.getItem("type")
  const block = localStorage.getItem("block")

  return (
    <div
      className={` lg:flex lg:h-screen h-[110vh] !w-[100vw] !overflow-x-hidden !bg-white`}
    >
      {!isMediumScreen ? <Sidebar /> : <MobileNavigation />}
      <div className="flex flex-col gap-3 h-screen lg:!w-[calc(100vw-16vw)] w-full !overflow-x-auto  ">
        {!isMediumScreen && (
          <div className="flex flex-col h-[6vh] text-white text-right p-2 w-full bg-gradient-to-br from-[#3575EB] via-[#1630B3] to-[#060E97]">
            {type === "Zone Manager" && ("Block : ")}        {type === "Admin" ? "Super Admin" : type === "Sub-Admin" ? "Admin" : type === "Zone Manager" ? block : type}
          </div>
        )}
        <div className="flex flex-col overflow-y-auto w-full lg:h-[83vh] !h-[100vh] glass lg:!p-1 !rounded-md">
          {component}
        </div>


        {!isMediumScreen && (
          <span className="flex text-secondary px-2  justify-end">
            <p>
              All Rights reserved to{' '}
              <span className="!font-bold">IFC Trade 2026</span>
            </p>
          </span>
        )}
      </div>


    </div>
  );
};

export default Layout;
