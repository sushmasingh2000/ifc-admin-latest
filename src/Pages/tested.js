// import { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { toast } from "react-toastify";
// import moment from "moment";
// import axiosInstance from "../config/axios";
// import { API_URLS, domain } from "../config/APIUrls";
// import CustomToPagination from "../Shared/CustomToPagination";
// import CustomFilter from "../Shared/CustomForFiler";
// import CustomMap from "../Shared/CustomMap";
// import { LocationOn } from "@mui/icons-material";

// const Attendance = () => {
//     const queryClient = useQueryClient();
//     const [page, setPage] = useState(1);
//     const [zoomImg, setZoomImg] = useState(null);
//     const [mapData, setMapData] = useState(null);

//     const [filters, setFilters] = useState({
//         zone: "",
//         village: "",
//         start_date: "",
//         end_date: "",
//         search: "",
//         status: "",
//     });

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters((prev) => ({ ...prev, [name]: value }));
//     };

//     const applyFilters = () => {
//         setPage(1);
//         queryClient.invalidateQueries(["get_attendance", page, filters]);
//     };

//     const clearFilters = () => {
//         setFilters({
//             zone: "",
//             village: "",
//             start_date: "",
//             end_date: "",
//             search: "",
//             status: "",
//         });
//         setPage(1);
//         queryClient.invalidateQueries(["get_attendance"]);
//     };

//     const { data: attData, isLoading: loading } = useQuery(
//         ["get_attendance", page, filters],
//         () =>
//             axiosInstance.get(API_URLS.get_attendance_report, {
//                 params: { ...filters, page, count: 10 },
//             }),
//         { refetchOnWindowFocus: false }
//     );

//     const attendanceList = attData?.data?.response || [];

//     const { data: zoneData } = useQuery(
//         "get_zone_master",
//         () =>
//             axiosInstance.get(API_URLS.get_zone_master, {
//                 params: { count: 1000000, status: "1" },
//             }),
//         { staleTime: Infinity }
//     );

//     const zoneOptions = zoneData?.data?.response?.data || [];

//     const { data: villageData } = useQuery(
//         ["get_village_master", filters.zone],
//         () =>
//             axiosInstance.get(API_URLS.get_village_master, {
//                 params: { count: 1000000, status: "1" },
//             }),
//         { staleTime: Infinity }
//     );

//     const villageOptions = villageData?.data?.response?.data || [];

//     const excelQuery = useQuery(
//         ["attendance_excel", filters],
//         () =>
//             axiosInstance.get(API_URLS.excel_attendance_report, {
//                 params: filters,
//                 responseType: "blob",
//             }),
//         { enabled: false }
//     );

//     const handleExport = async () => {
//         try {
//             const res = await excelQuery.refetch();
//             const blob = new Blob([res.data], { type: res.data.type });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = `attendance_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
//             link.click();
//             toast.success("File downloaded!");
//         } catch {
//             toast.error("Failed to download");
//         }
//     };

//     const statusColors = {
//         HD: "bg-yellow-100",
//         L: "bg-blue-100",
//         A: "bg-red-100",
//         P: "bg-green-100",
//         WO: "bg-gray-300",
//         M: "bg-orange-200",
//         H: "bg-purple-200",
//     };

//     return (
//         <div className="mx-5 relative">
//             <div className="flex justify-between items-center p-1 mb-4">
//                 <p className="font-bold text-xl">Employee Attendance :</p>

//                 <div className="flex gap-1 items-end flex-wrap">
//                     <select name="status" value={filters.status} onChange={handleFilterChange}
//                         className="border px-2 py-1 rounded">
//                         <option value="">Select Status</option>
//                         <option value="A">Absent</option>
//                         <option value="P">Present</option>
//                         <option value="HD">Half Day</option>
//                         <option value="L">Leave</option>
//                         <option value="WO">Week OFF</option>
//                         <option value="M">Missing</option>
//                         <option value="H">Holiday</option>
//                     </select>

//                     <select name="zone" value={filters.zone} onChange={handleFilterChange} className="border px-2 py-1 rounded">
//                         <option value="">Select Block</option>
//                         {zoneOptions.map(z => (
//                             <option key={z.m05_zn_id} value={z.m05_zn_id}>{z.m05_zn_name}</option>
//                         ))}
//                     </select>

//                     <select name="village" value={filters.village} onChange={handleFilterChange} className="border px-2 py-1 rounded">
//                         <option value="">Select Village</option>
//                         {villageOptions.map(v => (
//                             <option key={v.m06_vi_id} value={v.m06_vi_id}>{v.m06_vi_name}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <CustomFilter
//                 formik={{
//                     values: filters,
//                     handleChange: handleFilterChange,
//                 }}
//                 onFilter={applyFilters}
//                 onClear={clearFilters}
//                 onExport={handleExport}
//             />
//             <div className="overflow-auto border rounded shadow-sm max-h-[70vh] mt-5">
//                 <table className="min-w-full  py-2 border-collapse-separate border-spacing-y-2 text-sm">
//                     <thead className="!bg-[#EBE9FD] sticky top-0 z-10">
//                         <tr>
//                             {[
//                                 "S.No", "Block", "Village", "Name", "Mobile",
//                                 "Date/Time IN", "Date/Time OUT",
//                                 "Image IN", "Image OUT",
//                                 "Status IN", "Status OUT", "Final"
//                             ].map((h, i) => (
//                                 <th key={i} className=" border-b text-center !border-zinc-400 p-2 py-3">{h}</th>
//                             ))}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {loading ? (
//                             <tr>
//                                 <td colSpan="12" className="text-center py-4">Loading...</td>
//                             </tr>
//                         ) : attendanceList?.data?.length === 0 ? (
//                             <tr>
//                                 <td colSpan="12" className="text-center py-4 text-gray-500">
//                                     No records found
//                                 </td>
//                             </tr>
//                         ) : (
//                             attendanceList?.data?.map((item, index) => {
//                                 const rowColor = statusColors[item.e03_final_status] || "";
//                                 return (
//                                     <tr key={index}  className={`${rowColor } ` }>
//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">{index + 1}</td>
//                                         <td className=" text-xs  text-center p-2 border-b border-zinc-400">{item.m05_zn_name || "--"}</td>
//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">{item.m06_vi_name || "--"}</td>
//                                         <td className=" text-xs  text-center p-2 border-b border-zinc-400">{item.e02_f_name || "--"}</td>
//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">{item.e01_mob || "--"}</td>

//                                         <td className=" text-xs  text-center p-2 border-b border-zinc-400">
//                                             {item.e03_att_datetime_in ? moment?.utc(item.e03_att_datetime_in)?.format("HH:mm:ss DD-MM-YYYY") : "--"}
//                                         </td>

//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">
//                                             {item.e03_att_datetime_out ? moment?.utc(item.e03_att_datetime_out)?.format("HH:mm:ss DD-MM-YYYY") : "--"}
//                                         </td>

//                                         <td className="   text-xs text-center p-2 border-b border-zinc-400">

//                                             <div className="flex justify-center">
//                                                 {item.e03_att_lat_in && (
//                                                     <LocationOn
//                                                         style={{ color: "red", cursor: "pointer", marginTop: "1px" }}
//                                                         onClick={() => {
//                                                             const locs = [];
//                                                             locs.push({
//                                                                 lat: Number(item.e03_att_lat_in),
//                                                                 lng: Number(item.e03_att_lng_in),
//                                                                 address: item.e03_att_locat_in,
//                                                                 img: domain + item.e03_att_img_in,
//                                                                 radius: item.m06_vi_radius,
//                                                                 type: "IN"
//                                                             });
//                                                             if (item.e03_att_lat_out && item.e03_att_lat_out !== "0.00000") {
//                                                                 locs.push({
//                                                                     lat: Number(item.e03_att_lat_out),
//                                                                     lng: Number(item.e03_att_lng_out),
//                                                                     address: item.e03_att_locat_out,
//                                                                     img: domain + item.e03_att_img_out,
//                                                                     radius: item.m06_vi_radius,
//                                                                     type: "OUT"
//                                                                 });
//                                                             }
//                                                             setMapData(locs);
//                                                         }}
//                                                     />
//                                                 )}
//                                                 <img
//                                                     src={domain + item.e03_att_img_in}
//                                                     className="h-7 w-7 rounded-full cursor-pointer"
//                                                     onClick={() => setZoomImg(domain + item.e03_att_img_in)}
//                                                 />
//                                             </div>
//                                         </td>

//                                         <td className="text-xs  text-center p-2 border-b border-zinc-400">
//                                             <img
//                                                 src={domain + item.e03_att_img_out}
//                                                 className="h-7 w-7 rounded-full cursor-pointer"
//                                                 onClick={() => setZoomImg(domain + item.e03_att_img_out)}
//                                             />
//                                         </td>

//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">{item.e03_att_type_in || "--"}</td>
//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400">{item.e03_att_type_out || "--"}</td>
//                                         <td className=" text-xs text-center p-2 border-b border-zinc-400 font-semibold">{item.e03_final_status}</td>
//                                     </tr>
//                                 );
//                             })
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             <CustomToPagination setPage={setPage} page={page} data={attendanceList} />
//             {zoomImg && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//                     onClick={() => setZoomImg(null)}>
//                     <img src={zoomImg} className="max-h-[90%] max-w-[90%] rounded" />
//                 </div>
//             )}
//             {mapData && (
//                 <CustomMap locations={mapData} onClose={() => setMapData(null)} />
//             )}
//         </div>
//     );
// };

// export default Attendance;


// import { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { toast } from "react-toastify";
// import moment from "moment";
// import axiosInstance from "../config/axios";
// import { API_URLS, domain } from "../config/APIUrls";
// import CustomToPagination from "../Shared/CustomToPagination";
// import CustomFilter from "../Shared/CustomForFiler";
// import CustomMap from "../Shared/CustomMap";
// import { LocationOn } from "@mui/icons-material";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Skeleton,
//   Paper,
// } from "@mui/material";

// const Attendance = () => {
//   const queryClient = useQueryClient();
//   const [page, setPage] = useState(1);
//   const [zoomImg, setZoomImg] = useState(null);
//   const [mapData, setMapData] = useState(null);

//   const [filters, setFilters] = useState({
//     zone: "",
//     village: "",
//     start_date: "",
//     end_date: "",
//     search: "",
//     status: "",
//   });

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = () => {
//     setPage(1);
//     queryClient.invalidateQueries(["get_attendance", page, filters]);
//   };

//   const clearFilters = () => {
//     setFilters({
//       zone: "",
//       village: "",
//       start_date: "",
//       end_date: "",
//       search: "",
//       status: "",
//     });
//     setPage(1);
//     queryClient.invalidateQueries(["get_attendance"]);
//   };

//   const { data: attData, isLoading: loading } = useQuery(
//     ["get_attendance", page, filters],
//     () =>
//       axiosInstance.get(API_URLS.get_attendance_report, {
//         params: { ...filters, page, count: 10 },
//       }),
//     { refetchOnWindowFocus: false }
//   );

//   const attendanceList = attData?.data?.response || [];

//   const { data: zoneData } = useQuery(
//     "get_zone_master",
//     () =>
//       axiosInstance.get(API_URLS.get_zone_master, {
//         params: { count: 1000000, status: "1" },
//       }),
//     { staleTime: Infinity }
//   );
//   const zoneOptions = zoneData?.data?.response?.data || [];

//   const { data: villageData } = useQuery(
//     ["get_village_master", filters.zone],
//     () =>
//       axiosInstance.get(API_URLS.get_village_master, {
//         params: { count: 1000000, status: "1" },
//       }),
//     { staleTime: Infinity }
//   );
//   const villageOptions = villageData?.data?.response?.data || [];

//   const excelQuery = useQuery(
//     ["attendance_excel", filters],
//     () =>
//       axiosInstance.get(API_URLS.excel_attendance_report, {
//         params: filters,
//         responseType: "blob",
//       }),
//     { enabled: false }
//   );

//   const handleExport = async () => {
//     try {
//       const res = await excelQuery.refetch();
//       const blob = new Blob([res.data], { type: res.data.type });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `attendance_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
//       link.click();
//       toast.success("File downloaded!");
//     } catch {
//       toast.error("Failed to download");
//     }
//   };

//   const statusColors = {
//     HD: "#FEF3C7", // yellow
//     L: "#DBEAFE",  // blue
//     A: "#FEE2E2",  // red
//     P: "#D1FAE5",  // green
//     WO: "#E5E7EB", // gray
//     M: "#FED7AA",  // orange
//     H: "#E9D5FF",  // purple
//   };

//   const tableHead = [
//     "S.No", "Block", "Village", "Name", "Mobile",
//     "Date/Time IN", "Date/Time OUT",
//     "Image IN", "Image OUT",
//     "Status IN", "Status OUT", "Final Status"
//   ];

//   return (
//     <div className="mx-5 relative">
//       {/* Filters */}
//       <div className="flex justify-between items-center p-1 mb-4 flex-wrap gap-2">
//         <p className="font-bold text-xl">Employee Attendance :</p>

//         <div className="flex gap-2 items-end flex-wrap">
//           <select
//             name="status"
//             value={filters.status}
//             onChange={handleFilterChange}
//             className="border px-2 py-1 rounded"
//           >
//             <option value="">Select Status</option>
//             <option value="A">Absent</option>
//             <option value="P">Present</option>
//             <option value="HD">Half Day</option>
//             <option value="L">Leave</option>
//             <option value="WO">Week OFF</option>
//             <option value="M">Missing</option>
//             <option value="H">Holiday</option>
//           </select>

//           <select
//             name="zone"
//             value={filters.zone}
//             onChange={handleFilterChange}
//             className="border px-2 py-1 rounded"
//           >
//             <option value="">Select Block</option>
//             {zoneOptions.map((z) => (
//               <option key={z.m05_zn_id} value={z.m05_zn_id}>
//                 {z.m05_zn_name}
//               </option>
//             ))}
//           </select>

//           <select
//             name="village"
//             value={filters.village}
//             onChange={handleFilterChange}
//             className="border px-2 py-1 rounded"
//           >
//             <option value="">Select Village</option>
//             {villageOptions.map((v) => (
//               <option key={v.m06_vi_id} value={v.m06_vi_id}>
//                 {v.m06_vi_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <CustomFilter
//         formik={{
//           values: filters,
//           handleChange: handleFilterChange,
//         }}
//         onFilter={applyFilters}
//         onClear={clearFilters}
//         onExport={handleExport}
//       />

//       {/* ---------- MUI TABLE ---------- */}
//       <TableContainer component={Paper} className="mt-5 max-h-[70vh] overflow-auto">
//         <Table stickyHeader>
//           <TableHead className="!bg-[#EBE9FD]">
//             <TableRow>
//               {tableHead.map((head, i) => (
//                 <TableCell
//                   key={i}
//                   className="!font-bold !text-center !bg-[#EBE9FD]"
//                 >
//                   {head}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               Array.from({ length: 10 }).map((_, idx) => (
//                 <TableRow key={idx}>
//                   {tableHead.map((_, i) => (
//                     <TableCell key={i}>
//                       <Skeleton />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : attendanceList?.data?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={tableHead.length} className="text-center py-6 text-gray-600 font-semibold">
//                   No records found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               attendanceList.data.map((item, idx) => {
//                 const bgColor = statusColors[item.e03_final_status] || "white";
//                 return (
//                   <TableRow key={idx} sx={{ backgroundColor: bgColor }}>
//                     <TableCell align="center">{idx + 1}</TableCell>
//                     <TableCell align="center">{item.m05_zn_name || "--"}</TableCell>
//                     <TableCell align="center">{item.m06_vi_name || "--"}</TableCell>
//                     <TableCell align="center">{item.e02_f_name || "--"}</TableCell>
//                     <TableCell align="center">{item.e01_mob || "--"}</TableCell>
//                     <TableCell align="center">
//                       {item.e03_att_datetime_in ? moment.utc(item.e03_att_datetime_in).format("HH:mm:ss DD-MM-YYYY") : "--"}
//                     </TableCell>
//                     <TableCell align="center">
//                       {item.e03_att_datetime_out ? moment.utc(item.e03_att_datetime_out).format("HH:mm:ss DD-MM-YYYY") : "--"}
//                     </TableCell>
//                     <TableCell align="center">
//                       <div className="flex justify-center items-center gap-1">
//                         {item.e03_att_lat_in && (
//                           <LocationOn
//                             style={{ color: "red", cursor: "pointer" }}
//                             onClick={() => {
//                               const locs = [];
//                               locs.push({
//                                 lat: Number(item.e03_att_lat_in),
//                                 lng: Number(item.e03_att_lng_in),
//                                 address: item.e03_att_locat_in,
//                                 img: domain + item.e03_att_img_in,
//                                 radius: item.m06_vi_radius,
//                                 type: "IN",
//                               });
//                               if (item.e03_att_lat_out && item.e03_att_lat_out !== "0.00000") {
//                                 locs.push({
//                                   lat: Number(item.e03_att_lat_out),
//                                   lng: Number(item.e03_att_lng_out),
//                                   address: item.e03_att_locat_out,
//                                   img: domain + item.e03_att_img_out,
//                                   radius: item.m06_vi_radius,
//                                   type: "OUT",
//                                 });
//                               }
//                               setMapData(locs);
//                             }}
//                           />
//                         )}
//                         <img
//                           src={domain + item.e03_att_img_in}
//                           className="h-7 w-7 rounded-full cursor-pointer"
//                           onClick={() => setZoomImg(domain + item.e03_att_img_in)}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell align="center">
//                       <img
//                         src={domain + item.e03_att_img_out}
//                         className="h-7 w-7 rounded-full cursor-pointer"
//                         onClick={() => setZoomImg(domain + item.e03_att_img_out)}
//                       />
//                     </TableCell>
//                     <TableCell align="center">{item.e03_att_type_in || "--"}</TableCell>
//                     <TableCell align="center">{item.e03_att_type_out || "--"}</TableCell>
//                     <TableCell align="center" className="font-semibold">
//                       {item.e03_final_status || "--"}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <CustomToPagination setPage={setPage} page={page} data={attendanceList} />

//       {/* ---------- Zoom Image Modal ---------- */}
//       {zoomImg && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
//           onClick={() => setZoomImg(null)}
//         >
//           <img src={zoomImg} className="max-h-[90%] max-w-[90%] rounded" />
//         </div>
//       )}

//       {/* ---------- Map Modal ---------- */}
//       {mapData && <CustomMap locations={mapData} onClose={() => setMapData(null)} />}
//     </div>
//   );
// };

// export default Attendance;
