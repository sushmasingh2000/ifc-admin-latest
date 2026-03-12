import { Add, AddBox, Edit, Lock, NoTransfer, SwapVert } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URLS } from "../config/APIUrls";
import axiosInstance from "../config/axios";
import CustomDialog from "../Shared/CustomDialogBox";
import CustomTable from "../Shared/CustomTable";
import moment from "moment";
import CustomToPagination from "../Shared/CustomToPagination";
import CustomFilter from "../Shared/CustomForFiler";
import { useLocation, useNavigate } from "react-router-dom";
import { empregistration } from "../Shared/Schema";


const EmployeeRegistration = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();
    const user_type = localStorage.getItem("type")
    const [isTransfer, setIsTransfer] = useState(false);
    const location = useLocation();
    const [pageSize, setPageSize] = useState(10);

    const handleTransfer = (row) => {
        setEditData(row);
        setIsTransfer(true);
        fk.setValues({
            ...fk.values, // keep existing values
            district: row.e02_dist,  // optional, if needed
            zone: row.e02_zone,
            village: row.e02_vill,
            shift: row.e02_shift,
            grade: row.e02_grade,
            qualification: row.e02_qualification,
            f_name: row.e02_f_name,
            l_name: row.e02_l_name,
            gender: row.e02_gender,
            bank: row.e02_bank_name,
            bnk_acc_no: row.e02_bank_acc_no,
            ifsc_code: row.e02_bank_ifsc,
            govt_id: row.e02_govt_id,
            dob: row.e02_dob ? moment(row.e02_dob, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
            joining_date: row.e02_joining_date ? moment(row.e02_joining_date, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
            mobile: row.e01_mob,
            password: row.e01_password,
            email: row.e01_email,
        });
        setOpen(true);
    };

    const filterFormik = useFormik({
        initialValues: {
            district: "",
            zone: location.state?.zone_id || "",
            village: "",
            status: "",
            start_date: "",
            end_date: "",
            search: "",
        },
        enableReinitialize: true,
    });

    const filters = filterFormik.values;

    const { data: empData, isLoading: loading } = useQuery(
        ["get_employee", page, filters, pageSize],
        () =>
            axiosInstance.get(API_URLS.get_emp_report, {
                params: { ...filters, page, count: pageSize },
            }),
        { refetchOnWindowFocus: true }
    );

    const employeeList = empData?.data?.response || [];

    const { data: districtData } = useQuery(
        "get_district_master",
        () =>
            axiosInstance.get(API_URLS.get_district_master, {
                params: { count: 1000000, status: "1" },
            }),
        { refetchOnWindowFocus: false }
    );
    const districtOptions = districtData?.data?.response?.data || [];

    const { data: bankData } = useQuery(
        "get_bank",
        () =>
            axiosInstance.get(API_URLS.get_bank, {
                params: { count: 1000000, status: "1" },
            }),
        { staleTime: Infinity }
    );
    const bankOptions = bankData?.data?.response || [];

    const { data: qualificationData } = useQuery(
        "get_qualification_master",
        () =>
            axiosInstance.get(API_URLS.get_qualification_master, {
                params: { count: 1000000, status: "1" },
            }),
        { staleTime: Infinity }
    );
    const qualificationOptions = qualificationData?.data?.response?.data || [];

    const fk = useFormik({
        initialValues: {
            district: "",
            zone: "",
            village: "",
            shift: "",
            grade: "",
            qualification: "",
            f_name: "",
            l_name: "",
            gender: "",
            bank: "",
            bnk_acc_no: "",
            ifsc_code: "",
            govt_id: "",
            dob: "",
            joining_date: "",
            mobile: "",
            password: "",
            email: "",
        },
        validationSchema: isTransfer ? undefined : empregistration,
        onSubmit: async (values) => {
            try {

                let apiUrl = "";
                let reqBody = {};

                if (editData) {
                    apiUrl = API_URLS.update_emp_profile_update_by_admin;
                    reqBody = {
                        emp_id: editData.e02_reg_id,
                        dist: values.district,
                        zone: values.zone,
                        vil: values.village,
                        shift: values.shift,
                        desig: 4,
                        grade: values.grade,
                        quali: values.qualification,
                        f_name: values.f_name,
                        l_name: values.l_name,
                        gender: values.gender,
                        bank_name: values.bank,
                        bnk_acc_no: String(values.bnk_acc_no),
                        ifsc_code: values.ifsc_code,
                        govt_id: values.govt_id,
                        dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : null,
                        join_date: moment(values.joining_date).format("YYYY-MM-DD"),
                        p_ad_mobile: String(values.mobile),
                        p_ad_pass: values.password,
                        p_ad_mail: values.email,
                    };
                }

                else {
                    apiUrl = API_URLS.create_emp_registration;
                    reqBody = {
                        dist: values.district,
                        zone: values.zone,
                        vil: values.village,
                        shift: values.shift,
                        desig: 4,
                        grade: values.grade,
                        quali: values.qualification,
                        f_name: values.f_name,
                        l_name: values.l_name,
                        gender: values.gender,
                        bank_name: values.bank,
                        bnk_acc_no: String(values.bnk_acc_no),
                        ifsc_code: values.ifsc_code,
                        govt_id: values.govt_id,
                        dob: moment(values.dob || new Date()).format("YYYY-MM-DD"),
                        join_date: moment(values.joining_date).format("YYYY-MM-DD"),
                        p_ad_mobile: String(values.mobile),
                        p_ad_pass: values.password,
                        p_ad_mail: values.email,
                    };
                }

                const res = await axiosInstance.post(apiUrl, reqBody);

                toast(res?.data?.msg);
                if (res?.data?.success) {
                    setOpen(false);
                    fk.resetForm();
                    setEditData(null);
                }

                queryClient.invalidateQueries(["get_employee"]);

            } catch (error) {
                toast.error("Something went wrong");
            }
        },
    });



    const handleEdit = (row) => {
        setEditData(row);
        fk.setValues({
            district: row.e02_dist,
            zone: row.e02_zone,
            village: row.e02_vill,
            shift: row.e02_shift,
            grade: row.e02_grade,
            qualification: row.e02_qualification,
            f_name: row.e02_f_name,
            l_name: row.e02_l_name,
            gender: row.e02_gender,
            bank: row.e02_bank_name,
            bnk_acc_no: row.e02_bank_acc_no,
            ifsc_code: row.e02_bank_ifsc,
            govt_id: row.e02_govt_id,
            dob: row.e02_dob ? moment(row.e02_dob, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
            joining_date: row.e02_joining_date ? moment(row.e02_joining_date, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
            mobile: row.e01_mob,
            password: row.e01_password,
            email: row.e01_email,
        });
        setOpen(true);
    };

    const { zone: selectedZone } = filterFormik.values;

    const { data: zoneData } = useQuery(
        ["get_zone_master"],
        () =>
            axiosInstance.get(API_URLS.get_zone_master, {
                params: { count: 1000000, status: "1", district: districtOptions?.[0]?.m04_dist_id },
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false
        }
    );

    const zoneOptions = zoneData?.data?.response?.data || [];

    const { data: villageData } = useQuery(
        ["get_village_master", selectedZone],
        () =>
            axiosInstance.get(API_URLS.get_village_master, {
                params: { count: 1000000, status: "1", zone: selectedZone },
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            enabled: !!selectedZone,
        }
    );
    const villageOptions = villageData?.data?.response?.data || [];

    const { data: gradeData } = useQuery(
        "get_grade_master",
        () =>
            axiosInstance.get(API_URLS.get_grade_master, {
                params: { count: 1000000, status: "1" },
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false
        }
    );
    const gradeOptions = gradeData?.data?.response?.data || [];

    const { data: shiftData } = useQuery(
        "get_shift",
        () =>
            axiosInstance.get(API_URLS.get_shift, {
                params: { count: 1000000, status: "1" },
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false
        }
    );
    const shiftOptions = shiftData?.data?.response?.data || [];

    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Deactive", value: "Deactive" },
        { label: "Attendance Blocked", value: "Attendance Blocked" },
        { label: "Resigned", value: "Resigned" },
    ];

    const toggleStatus = async (row, newStatus) => {
        try {
            const res = await axiosInstance.post(API_URLS.emp_profile_update_status, {
                e02_reg_id: row.e02_reg_id,
                status: newStatus,
            });
            toast(res?.data?.msg);
            queryClient.invalidateQueries(["get_employee"]);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleExport = async () => {
        try {
            const res = await axiosInstance.get(
                API_URLS.excel_emp_report,
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
        "S.No", "Full Name", "Transfer", "Gender", "Qualification",
        "District", "Block", "Village", "Shift",
        //  "Grade", "Bank Name", "Bank AccNo.", "IFSC", 
        "Govt ID", "Email",
        "Mobile", "Password", "DOB", "Joining", "Status", "Actions"
    ];

    const tableRows = employeeList?.data?.map((item, index) => [
        index + 1,
        <span className="hover:underline cursor-pointer text-blue-600"
            onClick={() => navigate(`/emp/${item.e02_reg_id}`)}>
            {(item.e02_f_name + ' ' + item.e02_l_name) || '--'} </span>,
        <SwapVert className="!text-green-600 cursor-pointer"
            onClick={() => handleTransfer(item)} />,
        item.e02_gender || "--",
        item.m09_ql_qualification || "--",
        item.m04_dist_name || "--",
        item.m05_zn_name || "--",
        item.m06_vi_name || "--",
        item.m07_sh_name || "--",
        // item.m08_gd_name || "--",
        // item.e02_bank_name || "--",
        // item.e02_bank_acc_no || "--",
        // item.e02_bank_ifsc || "--",
        item.e02_govt_id || "--",
        item.e01_email || "--",
        item.e01_mob || "--",
        item.e01_password || "--",
        <span> {item.e02_dob ? moment(item.e02_dob)?.format("DD-MM-YYYY") : "--"}</span>,
        <span>{item.e02_joining_date ? moment(item.e02_joining_date)?.format("DD-MM-YYYY") : "--"}</span>,

        <span>
            {user_type === "Admin" ?
                <select
                    defaultValue={item.e02_status}
                    onChange={(e) => toggleStatus(item, e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select> : item?.e02_status || "--"
            }
        </span>,
        <span>
            {user_type === "Admin" ?
                <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(item)}>
                        <Edit className="text-blue-600" />
                    </IconButton>
                </Tooltip> : <Lock />} </span>
    ]);

    return (
        <div className="mx-5">
            <div className="data_filter_box">
                <div className="flex justify-between items-center gap-3 mb-4">
                    <p className="font-bold text-lg lg:text-xl whitespace-nowrap">Employee Registration </p>
                    {user_type === "Admin" && (
                        <Button
                            size="small"
                            variant="contained"
                            className="ml-auto  lg:!text-lg  !text-xs"
                            onClick={() => {
                                fk.resetForm();
                                setEditData(null);
                                setOpen(true);
                            }}
                        >
                            + ADD
                        </Button>
                    )}
                </div>
                <div className="flex lg:flex-row flex-col gap-4">
                    <p className="font-bold flex items-center">Select Filter : </p>
                    <select
                        name="zone"
                        value={filters.zone}
                        onChange={filterFormik.handleChange}
                        className="border px-3 py-2 rounded min-w-[180px]"
                    >
                        <option value="">Select Block</option>
                        {zoneOptions.map(z => (
                            <option key={z.m05_zn_id} value={z.m05_zn_id}>
                                {z.m05_zn_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="village"
                        value={filters.village}
                        onChange={filterFormik.handleChange}
                        className="border px-3 py-2 rounded min-w-[180px]"
                    >
                        <option value="">Select Village</option>
                        {villageOptions.map(v => (
                            <option key={v.m06_vi_id} value={v.m06_vi_id}>
                                {v.m06_vi_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={filterFormik.handleChange}
                        className="border px-3 py-2 rounded min-w-[180px]"
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
                formik={filterFormik}
                onFilter={() => {
                    setPage(1);
                    setPageSize(10)
                    queryClient.invalidateQueries(["get_employee"]);
                }}
                onClear={() => {
                    filterFormik.resetForm();
                    setPage(1);
                    setPageSize(10)
                    queryClient.invalidateQueries(["get_employee"]);
                }}
                onExport={handleExport}
            />
            <CustomTable tablehead={tableHead} tablerow={tableRows} isLoading={loading} />
            <CustomToPagination setPage={setPage} page={page} data={employeeList} pageSize={pageSize} setPageSize={setPageSize} />
            <CustomDialog
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={fk.handleSubmit}
                formik={fk}
                title={isTransfer ? "Transfer Employee" : editData ? "Edit Employee" : "Add Employee"}
                fields={
                    isTransfer
                        ? [
                            {
                                name: "zone",
                                label: "Block",
                                type: "select",
                                options: zoneOptions.map((z) => ({
                                    label: z.m05_zn_name,
                                    value: z.m05_zn_id
                                })),
                                error: fk.touched.zone && Boolean(fk.errors.zone),
                                helperText: fk.touched.zone && fk.errors.zone,
                            },
                            {
                                name: "village",
                                label: "Village",
                                type: "select",
                                options: villageOptions.map((v) => ({
                                    label: v.m06_vi_name,
                                    value: v.m06_vi_id
                                })),
                                error: fk.touched.village && Boolean(fk.errors.village),
                                helperText: fk.touched.village && fk.errors.village,
                            }
                        ]
                        : [
                            {
                                name: "district",
                                label: "District",
                                type: "select",
                                options: districtOptions.map((d) => ({
                                    label: d.m04_dist_name,
                                    value: d.m04_dist_id
                                })),
                                error: fk.touched.district && Boolean(fk.errors.district),
                                helperText: fk.touched.district && fk.errors.district,
                            },
                            {
                                name: "zone",
                                label: "Block",
                                type: "select",
                                options: zoneOptions.map((z) => ({
                                    label: z.m05_zn_name,
                                    value: z.m05_zn_id
                                })),
                                error: fk.touched.zone && Boolean(fk.errors.zone),
                                helperText: fk.touched.zone && fk.errors.zone,
                            },
                            {
                                name: "village",
                                label: "Village",
                                type: "select",
                                options: villageOptions.map((v) => ({
                                    label: v.m06_vi_name,
                                    value: v.m06_vi_id
                                })),
                                error: fk.touched.village && Boolean(fk.errors.village),
                                helperText: fk.touched.village && fk.errors.village,
                            },
                            {
                                name: "shift",
                                label: "Shift",
                                type: "select",
                                options: shiftOptions.map((v) => {
                                    const startTime = v.m07_sh_start_time.split(":").slice(0, 2).join(":");
                                    const endTime = v.m07_sh_end_time.split(":").slice(0, 2).join(":");
                                    return {
                                        label: `${v.m07_sh_name} (${startTime} - ${endTime})`,
                                        value: v.m07_sh_id
                                    };
                                }),
                                error: fk.touched.shift && Boolean(fk.errors.shift),
                                helperText: fk.touched.shift && fk.errors.shift,
                            },
                            {
                                name: "grade",
                                label: "Grade",
                                type: "select",
                                options: gradeOptions.map((q) => ({
                                    label: q.m08_gd_name,
                                    value: q.m08_gd_id
                                })),
                                error: fk.touched.grade && Boolean(fk.errors.grade),
                                helperText: fk.touched.grade && fk.errors.grade,
                            },
                            {
                                name: "qualification",
                                label: "Qualification",
                                type: "select",
                                options: qualificationOptions.map((q) => ({
                                    label: q.m09_ql_qualification,
                                    value: q.m09_ql_id
                                })),
                                error: fk.touched.qualification && Boolean(fk.errors.qualification),
                                helperText: fk.touched.qualification && fk.errors.qualification,
                            },
                            {
                                name: "f_name",
                                label: "First Name",
                                error: fk.touched.f_name && Boolean(fk.errors.f_name),
                                helperText: fk.touched.f_name && fk.errors.f_name,
                            },
                            {
                                name: "l_name",
                                label: "Last Name",

                            },
                            {
                                name: "gender",
                                label: "Gender",
                                type: "select",
                                options: [
                                    { label: "Male", value: "M" },
                                    { label: "Female", value: "F" },
                                    { label: "Other", value: "O" },
                                ],
                                error: fk.touched.gender && Boolean(fk.errors.gender),
                                helperText: fk.touched.gender && fk.errors.gender,
                            },
                            {
                                name: "bank",
                                label: "Bank",
                                type: "select",
                                options: bankOptions.map((b) => ({
                                    label: b.m_bank_name,
                                    value: b.m_bank_name
                                })),

                            },
                            {
                                name: "bnk_acc_no",
                                label: "Bank Account No",
                                type: "number",

                            },
                            {
                                name: "ifsc_code",
                                label: "IFSC Code",

                            },
                            { name: "govt_id", label: "Govt ID" },
                            {
                                name: "dob",
                                label: "DOB",
                                type: "date",

                            },
                            {
                                name: "joining_date",
                                label: "Joining Date",
                                type: "date",
                                error: fk.touched.joining_date && Boolean(fk.errors.joining_date),
                                helperText: fk.touched.joining_date && fk.errors.joining_date,
                            },
                            {
                                name: "mobile",
                                label: "Mobile",
                                type: "number",
                                error: fk.touched.mobile && Boolean(fk.errors.mobile),
                                helperText: fk.touched.mobile && fk.errors.mobile,
                            },
                            {
                                name: "password",
                                label: "Password",
                                error: fk.touched.password && Boolean(fk.errors.password),
                                helperText: fk.touched.password && fk.errors.password,
                            },
                            {
                                name: "email",
                                label: "Email",
                                type: "email",

                            },
                        ]}

            />
        </div>


    );
};

export default EmployeeRegistration;
