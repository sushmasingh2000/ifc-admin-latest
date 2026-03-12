import { LocationOn } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URLS, domain } from "../config/APIUrls";
import axiosInstance from "../config/axios";
import CustomFilter from "../Shared/CustomForFiler";
import CustomMap from "../Shared/CustomMap";
import CustomTable from "../Shared/CustomTable";
import CustomToPagination from "../Shared/CustomToPagination";

const Attendance = () => {
    const formatDate = (d) => d.toISOString().split("T")[0];
    const location = useLocation();
    const queryClient = useQueryClient();
    const today = formatDate(new Date());
    const [page, setPage] = useState(1);
    const [zoomImg, setZoomImg] = useState(null);
    const [mapData, setMapData] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const zoneId = location.state?.zone_id;

    useEffect(() => {
        if (zoneId) {
            setFilters((prev) => ({
                ...prev,
                zone: zoneId,
            }));
            setPage(1);
            setPageSize(10)
        }
    }, [zoneId]);


    useEffect(() => {
        if (location.state) {
            setFilters((prev) => ({
                ...prev,
                zone: location.state.zone_id || "",
                status: location.state.status || "",
            }));
            setPage(1);
            setPageSize(10)
        }
    }, [location.state]);


    const [filters, setFilters] = useState({
        zone: "",
        village: "",
        start_date: today,
        end_date: today,
        search: "",
        status: "",

    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        setPage(1);
        setPageSize(10)
        queryClient.invalidateQueries(["get_attendance", page, filters]);
    };

    const clearFilters = () => {
        setFilters({
            zone: "",
            village: "",
            start_date: "",
            end_date: "",
            search: "",
            status: "",

        });
        setPage(1);
        setPageSize(10)
        queryClient.invalidateQueries(["get_attendance"]);
    };

    const { data: attData} = useQuery(
        ["get_attendance", page, filters, pageSize],
        () =>
            axiosInstance.get(API_URLS.get_attendance_report, {
                params: { ...filters, page, count: pageSize },
            }),
        { refetchOnWindowFocus: true }
    );

    const attendanceList = attData?.data?.response || [];

    const { data: zoneData } = useQuery(
        "get_zone_master",
        () =>
            axiosInstance.get(API_URLS.get_zone_master, {
                params: { count: 1000000, status: "1" },
            }),
        { refetchOnWindowFocus: true }
    );

    const zoneOptions = zoneData?.data?.response?.data || [];

    const { data: villageData } = useQuery(
        ["get_village_master", filters.zone],
        () =>
            axiosInstance.get(API_URLS.get_village_master, {
                params: { count: 1000000, status: "1", zone: filters.zone }, // add zone param here
            }),
        {
            enabled: !!filters.zone,
            refetchOnWindowFocus: true
        }
    );

    const villageOptions = villageData?.data?.response?.data || [];

    const handleExport = async () => {
        try {
            const res = await axiosInstance.get(
                API_URLS.excel_attendance_report,
                {
                    params: {
                        ...filters
                    }
                }
            );

            const fileUrl = res?.data?.response?.url;
            if (!fileUrl) {
                toast.error("No file URL found");
                return;
            }

            window.open(fileUrl, "_blank");
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong");
        }
    };

    const { data: totalData } = useQuery(
        ["get_attendance_total", filters],
        () =>
            axiosInstance.get(API_URLS.get_attendance_report, {
                params: { ...filters, page: 1, count: 1000000 },
            }),
        { refetchOnWindowFocus: false }
    );

    const summaryCounts = totalData?.data?.response?.data?.reduce(
        (acc, item) => {
            if (item.e03_final_status === "HD") acc.HD += 1;
            else if (item.e03_final_status === "L") acc.L += 1;
            else if (item.e03_final_status === "A") acc.A += 1;
            else if (item.e03_final_status === "P") acc.P += 1;
            else if (item.e03_final_status === "H") acc.H += 1;
            else if (item.e03_final_status === "WO") acc.WO += 1;
            else if (item.e03_final_status === "M") acc.M += 1;
            return acc;
        },
        { HD: 0, L: 0, A: 0, P: 0, H: 0, WO: 0, M: 0 }
    ) || { HD: 0, L: 0, A: 0, P: 0, H: 0, WO: 0, M: 0 };


    const statusOptions = [
        { label: "Absent", value: "A" },
        { label: "Present", value: "P" },
        { label: "Half Day", value: "HD" },
        { label: "Leave", value: "L" },
        { label: "Week OFF", value: "WO" },
        { label: "Missing", value: "M" },
        { label: "Holiday", value: "H" },
    ];

    const statusColors = {
        HD: "#cdcd2a",
        L: "#DBEAFE",
        A: "#FEE2E2",
        P: "#D1FAE5",
        WO: "#E5E7EB",
        M: "#FED7AA",
        H: "#E9D5FF",
    };

    const tableHead = [
        "S.No", "Date ", "Block", "Village",
        "Name", "Mobile No.", "Date/Time IN", "Date/Time OUT",
        "Profile IN", "Profile OUT", "Status IN", "Status OUT", "Final Status"
    ];

    const tableRows = attendanceList?.data?.map((item, index) => {
        return [
            <div className=" flex justify-between">
                {index + 1} </div>,
            <div>{item.created_at ? moment?.utc(item.created_at)?.format(" DD-MM-YYYY") : "--"}</div>,
            <div>{item.m05_zn_name || "--"}</div>,
            <div>{item.m06_vi_name || "--"}</div>,
            <div>{item.e02_f_name || "--"}</div>,
            <div>{item.e01_mob || "--"}</div>,
            <div>{item.e03_att_datetime_in ? moment?.utc(item.e03_att_datetime_in)?.format("HH:mm:ss DD-MM-YYYY") : "--"}</div>,
            <div> {item.e03_att_datetime_out ? moment?.utc(item.e03_att_datetime_out)?.format("HH:mm:ss DD-MM-YYYY") : "--"}</div>,
            <div className="flex justify-center items-center gap-1">
                {item.e03_att_lat_in && (
                    <LocationOn
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => {
                            const locs = [];
                            locs.push({
                                lat: Number(item.e03_att_lat_in),
                                lng: Number(item.e03_att_lng_in),
                                address: item.e03_att_locat_in,
                                img: domain + item.e03_att_img_in,
                                radius: item.m06_vi_radius,
                                type: "IN",
                            });
                            if (item.e03_att_lat_out && item.e03_att_lat_out !== "0.00000") {
                                locs.push({
                                    lat: Number(item.e03_att_lat_out),
                                    lng: Number(item.e03_att_lng_out),
                                    address: item.e03_att_locat_out,
                                    img: domain + item.e03_att_img_out,
                                    radius: item.m06_vi_radius,
                                    type: "OUT",
                                });
                            }
                            setMapData(locs);
                        }}
                    />
                )}
                <img
                    src={domain + item.e03_att_img_in}
                    className="h-7 w-7 rounded-full cursor-pointer"
                    onClick={() => setZoomImg(domain + item.e03_att_img_in)}
                />
            </div>,
            <div > <img
                src={domain + item.e03_att_img_out}
                className="h-7 w-7 rounded-full cursor-pointer"
                onClick={() => setZoomImg(domain + item.e03_att_img_out)}
            /></div>,
            <div >{item.e03_att_type_in || "--"}</div>,
            <div >{item.e03_att_type_out || "--"}</div>,
            <div className="px-2 min-w-fit" style={{ background: statusColors[item.e03_final_status] || "#000" }}  >
                {item.e03_final_status || "--"}
            </div>,


        ];
    });

    return (
        <div className="mx-5 ">
            <div className="data_filter_box">
                <div className="flex lg:flex-row flex-col justify-between  gap-3 p-1 mb-4 ">
                    <p className="font-bold text-xl"> Attendance :</p>
                    <div className=" flex gap-2  items-end">
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#D1FAE5] rounded ">P : {summaryCounts.P}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#c7d926] rounded ">HD : {summaryCounts.HD}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#DBEAFE] rounded ">L : {summaryCounts.L}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#FEE2E2] rounded ">A : {summaryCounts.A}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#E9D5FF] rounded ">H : {summaryCounts.H}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#E5E7EB] rounded ">WO : {summaryCounts.WO}</div>
                        <div className="lg:px-2 py-1 lg:text-sm text-xs text-center bg-[#FED7AA] rounded ">M : {summaryCounts.M}</div>
                    </div>
                </div>
                <div className="flex lg:flex-row flex-col gap-4">
                    <p className="font-bold flex items-center">Select Filter : </p>

                    <select name="status" value={filters.status} onChange={handleFilterChange}
                        className="border px-2 py-1 rounded"> <option value="">Select Status</option>
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <select name="zone" value={filters.zone} onChange={handleFilterChange} className="border  py-1 rounded">
                        <option value="">Select Block</option>
                        {zoneOptions.map(z => (
                            <option key={z.m05_zn_id} value={z.m05_zn_id}>{z.m05_zn_name}</option>
                        ))}
                    </select>

                    <select name="village" value={filters.village} onChange={handleFilterChange} className="border  py-1 rounded">
                        <option value="">Select Villages</option>
                        {villageOptions.map(v => (
                            <option key={v.m06_vi_id} value={v.m06_vi_id}>{v.m06_vi_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <CustomFilter
                formik={{
                    values: filters,
                    handleChange: handleFilterChange,
                }}
                onFilter={applyFilters}
                onClear={clearFilters}
                onExport={handleExport}
            />
         
            <CustomTable tablehead={tableHead} tablerow={tableRows} />

            <CustomToPagination setPage={setPage} page={page} data={attendanceList} pageSize={pageSize} setPageSize={setPageSize} />

            {zoomImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => setZoomImg(null)}
                >
                    <img src={zoomImg} alt="Zoom" className="max-h-[90%] max-w-[90%] rounded" />
                </div>
            )}
            {mapData && (
                <CustomMap
                    locations={mapData}
                    onClose={() => setMapData(null)}
                />
            )}
        </div>
    );
};

export default Attendance;

