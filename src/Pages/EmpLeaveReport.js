import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import moment from "moment";
import axiosInstance from "../config/axios";
import { API_URLS, domain } from "../config/APIUrls";
import CustomTable from "../Shared/CustomTable";
import CustomToPagination from "../Shared/CustomToPagination";
import CustomFilter from "../Shared/CustomForFiler";
import { useLocation } from "react-router-dom";

const EmpLeaveReport = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [zoomImg, setZoomImg] = useState(null);

    const location = useLocation();
    const formatDate = (d) => d.toISOString().split("T")[0];
    const today = formatDate(new Date());
    const zoneId = location.state?.zone_id;
    const user_type = localStorage.getItem("type")

    const formik = useFormik({
        initialValues: {
            district: "",
            zone: zoneId || "",
            village: "",
            status: location.state?.status || "",
            start_date: today || "",
            end_date: today || "",
            search: "",
        },
        enableReinitialize: true,
    });

    const filters = formik.values;

    const { data: leaveData, isLoading: loading } = useQuery(
        ["get_emp_leave_report", page, filters],
        () =>
            axiosInstance.get(API_URLS.get_emp_leave_report, {
                params: { ...filters, page, count: 10 },
            }),
        { refetchOnWindowFocus: false }
    );

    const leaveList = leaveData?.data?.response || [];

    const { data: zoneData } = useQuery(
        "get_zone_master",
        () =>
            axiosInstance.get(API_URLS.get_zone_master, {
                params: { count: 1000000, status: "1" }
            }),
        { staleTime: Infinity }
    );
    const zoneOptions = zoneData?.data?.response?.data || [];

    const { data: villageData } = useQuery(
        ["get_village_master", filters.zone],
        () =>
            axiosInstance.get(API_URLS.get_village_master, {
                params: { count: 1000000, status: "1", zone_id: filters.zone }
            }),
        { staleTime: Infinity }
    );
    const villageOptions = villageData?.data?.response?.data || [];

    const { data: districtData } = useQuery(
        "get_district_master",
        () =>
            axiosInstance.get(API_URLS.get_district_master, {
                params: { count: 1000000, status: "1" }
            }),
        { refetchOnWindowFocus: false }
    );
    const districtOptions = districtData?.data?.response?.data || [];

    const statusOptions = [
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
        { label: "Cancelled", value: "Cancelled" },
    ];

    const toggleStatus = async (row, newStatus) => {
        try {
            const res = await axiosInstance.post(API_URLS.status_emp_leave_report, {
                e04_l_id: row.e04_l_id,
                status: newStatus,
            });
            toast(res?.data?.msg);
            queryClient.invalidateQueries(["get_emp_leave_report", page, filters]);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleExport = async () => {
        try {
            const res = await axiosInstance.get(
                API_URLS.excel_emp_leave_report,
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

    const tableHead = [
        "S.No", "Block", "Village",
        "First Name", "Last Name", "CustId", "Total Days", "Start Date", "End Date", "Type", "Reason",
        "Manager Name", " Status"
    ];

    const tableRows = leaveList?.data?.map((item, index) => [
        index + 1,
        item.m05_zn_name,
        item.m06_vi_name,
        item.e02_f_name,
        item.e02_l_name,
        item.e02_identity,
        Number(item.e04_l_total_days)?.toFixed(0),
        moment.utc(item.e04_l_start_date).format(" DD-MM-YYYY"),
        moment.utc(item.e04_l_end_date).format(" DD-MM-YYYY"),
        item.m10_lv_type,
        item.e04_l_reason,
        item?.m01_full_name,
        <span>
            {user_type === "Admin" ?
                <select
                    defaultValue={item.e04_l_status}
                    onChange={(e) => toggleStatus(item, e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select> : item?.e04_l_status
            }
        </span>,

    ]);

    return (
        <div className="mx-5 relative">
            <div className="data_filter_box">
                <div className="flex justify-between items-center gap-3 mb-4">
                    <p className="font-bold text-lg lg:text-xl whitespace-nowrap">Employee Leave </p>

                </div>
                <div className="flex lg:flex-row flex-col gap-4">
                    <p className="font-bold flex items-center">Select Filter : </p>
                    <select name="district"
                        value={filters.district}
                        onChange={formik.handleChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Select Districts</option>
                        {districtOptions.map(d => (
                            <option key={d.m04_dist_id} value={d.m04_dist_id}>
                                {d.m04_dist_name}
                            </option>
                        ))}
                    </select>

                    <select name="zone"
                        value={filters.zone}
                        onChange={formik.handleChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Select Blocks</option>
                        {zoneOptions.map(z => (
                            <option key={z.m05_zn_id} value={z.m05_zn_id}>
                                {z.m05_zn_name}
                            </option>
                        ))}
                    </select>

                    <select name="village"
                        value={filters.village}
                        onChange={formik.handleChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Select Villages</option>
                        {villageOptions.map(v => (
                            <option key={v.m06_vi_id} value={v.m06_vi_id}>
                                {v.m06_vi_name}
                            </option>
                        ))}
                    </select>

                    <select name="status"
                        value={filters.status}
                        onChange={formik.handleChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Select Status</option>
                        {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                </div>
            </div>

            <CustomFilter
                formik={formik}
                onFilter={() => {
                    setPage(1);
                    queryClient.invalidateQueries("get_emp_leave_report");
                }}
                onClear={() => {
                    formik.resetForm({
                        values: {
                            district: "",
                            zone: "",
                            village: "",
                            status: "",
                            start_date: "",
                            end_date: "",
                            search: "",
                        },
                    });
                    setPage(1);
                    queryClient.invalidateQueries("get_emp_leave_report");
                }}

                onExport={handleExport}
            />

            <CustomTable tablehead={tableHead} tablerow={tableRows} isLoading={loading} />
            <CustomToPagination setPage={setPage} page={page} data={leaveList} />

            {zoomImg && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => setZoomImg(null)}
                >
                    <img src={zoomImg} className="max-h-[90%] max-w-[90%] rounded" />
                </div>
            )}
        </div>
    );
};

export default EmpLeaveReport;
