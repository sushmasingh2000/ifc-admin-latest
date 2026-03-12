import { Grid } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "react-query";
import axiosInstance from "../config/axios";
import { API_URLS } from "../config/APIUrls";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

const EmpDetail = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const { id } = useParams();

    const { data, isLoading } = useQuery(
        ["emp_dashboard_report", id],
        () =>
            axiosInstance.post(API_URLS.emp_dashboard_report, {
                emp_table_id: id,
                start_date: "",
                end_date: "",
                f_type: "this_month"
            })
    );

    const empData = data?.data?.response || {};


    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div
                    style={{
                        background: "#fff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: item.fill,
                    }}
                >
                    {item.name}
                </div>
            );
        }
        return null;
    };


    const radialData = [
        { name: `Present (${empData?.total_emp_present || 0})`, value: empData?.total_emp_present || 0, fill: "#0fa958" },
        { name: `Absent (${empData?.total_emp_absent || 0})`, value: empData?.total_emp_absent || 0, fill: "#ff3b30" },
        { name: `Half Day (${empData?.total_emp_half_day || 0})`, value: empData?.total_emp_half_day || 0, fill: "#cdcd2a" },
        { name: `Leave (${empData?.total_emp_leave || 0})`, value: empData?.total_emp_leave || 0, fill: "#ff9f0a" },
        { name: `Holiday (${empData?.total_emp_holiday || 0})`, value: empData?.total_emp_holiday || 0, fill: "#7a3cff" },
        { name: `Week Off (${empData?.total_emp_week_off || 0})`, value: empData?.total_emp_week_off || 0, fill: "#007aff" },
        { name: `Missing (${empData?.total_emp_missing || 0})`, value: empData?.total_emp_missing || 0, fill: "#8e8e93" },
    ];


    const layeredData = radialData.map((item, index) => ({
        ...item,
        innerRadius: 20 + index * 12,
        outerRadius: 30 + index * 12,
    }));

    const { data: attData, isLoading: loading } = useQuery(
        ["get_attendance",],
        () =>
            axiosInstance.get(API_URLS.get_attendance_report, {
                params: { count: 100000, emp_table_id: id },
            }),
        { refetchOnWindowFocus: false }
    );

    const attendanceList = attData?.data?.response?.data || [];

    const getTileClass = ({ date }) => {
        const today = date.toLocaleDateString("en-CA");
        const found = attendanceList.find((x) => {
            if (!x.created_at) return false;
            return x.created_at.split(" ")[0] === today;
        });

        if (!found) return "";

        switch (found.e03_final_status) {
            case "P": return "present";
            case "A": return "absent";
            case "HD": return "halfday";
            case "L": return "leave";
            case "WO": return "weekoff";
            case "H": return "holiday";
            case "M": return "missing";
            default: return "";
        }
    };



    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="px-5">
            <button
                onClick={() => navigate(-1)}
                className=" px-4 py-2 bg-gray-300 hover:bg-gray-400 mt-5 lg:mt-0 text-gray-800 rounded-md"
            >
                ← Back
            </button>

          

            <div className="lg:block hidden">
                <Grid container spacing={4} alignItems="center" justifyContent={"start"} gap={20} style={{ border: "none", boxShadow: "none" }}>
                    <Grid item xs={12} md={6}>
                        <RadialBarChart
                            width={480}
                            height={380}
                            cx="50%"
                            cy="50%"
                            startAngle={45}
                            endAngle={310}
                            data={layeredData}
                            border="none"
                        >
                            <RadialBar
                                dataKey="value"
                                clockWise
                                background={{ fill: "#eaeaea" }}
                                cornerRadius={50}
                            />

                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{
                                    paddingLeft: 0,
                                    fontSize: 18,
                                    lineHeight: "28px",
                                }}
                                iconSize={12}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </RadialBarChart>
                    </Grid>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={getTileClass}
                    />
                </Grid>
            </div>
            <div className="lg:hidden block">
                <Grid container spacing={4} alignItems="center" justifyContent={"start"} gap={20} style={{ border: "none", boxShadow: "none" }}>
                    <Grid item xs={12} md={6}>
                        <div style={{ width: "100%", height: 200 }}>
                            <RadialBarChart
                                width={480}
                                height={380}
                                cx="50%"
                                cy="50%"
                                startAngle={45}
                                endAngle={310}
                                data={layeredData}
                            >
                                <RadialBar
                                    dataKey="value"
                                    clockWise
                                    background={{ fill: "#eaeaea" }}
                                    cornerRadius={50}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </div>

                        <div className="legend-mobile-custom">
                            {layeredData.map((item, idx) => (
                                <div key={idx} className="legend-item">
                                    <span
                                        className="legend-dot"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </Grid>

                    <div className="!-mt-20 ">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            tileClassName={getTileClass}
                        />
                    </div>
                </Grid>
            </div>
        </div>
    );
};

export default EmpDetail;

