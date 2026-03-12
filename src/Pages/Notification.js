import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../config/axios";
import { API_URLS } from "../config/APIUrls";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { toast } from "react-toastify";

const SendNotification = () => {
    const [activeTab, setActiveTab] = useState("block");
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [selectedVillages, setSelectedVillages] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);

    const { data: zoneData } = useQuery(
        "get_zone_master",
        () =>
            axiosInstance.get(API_URLS.get_zone_master, {
                params: { status: "1", count: 1000000 },
            }),
        { refetchOnWindowFocus: true }
    );
    const blocks = zoneData?.data?.response?.data || [];

    const { data: villageData } = useQuery(
        "get_village_master",
        () =>
            axiosInstance.get(API_URLS.get_village_master, {
                params: { status: "1", count: 1000000 },
            }),
        { refetchOnWindowFocus: true }
    );
    const villages = villageData?.data?.response?.data || [];

    const { data: empData } = useQuery(
        "get_employee",
        () =>
            axiosInstance.get(API_URLS.get_emp_report, {
                params: { page: 1, count: 10000 },
            }),
         { refetchOnWindowFocus: true }
    );
    const employees = empData?.data?.response?.data || [];

    const getLabel = (item, type) => {
        if (type === "block") return item.m05_zn_name;
        if (type === "village") return item.m06_vi_name;
        if (type === "employee") return `${item.e02_f_name} ${item.e02_l_name}`;
        return "";
    };
    const getId = (item, type) => {
        if (type === "block") return item.m05_zn_id;
        if (type === "village") return item.m06_vi_id;
        if (type === "employee") return item.e02_reg_id;
        return null;
    };

    const getDataByTab = () => {
        if (activeTab === "block") return blocks;
        if (activeTab === "village") return villages;
        if (activeTab === "employee") return employees;
        return [];
    };

    const getSelectedByTab = () => {
        if (activeTab === "block") return [selectedBlocks, setSelectedBlocks];
        if (activeTab === "village") return [selectedVillages, setSelectedVillages];
        if (activeTab === "employee") return [selectedEmployees, setSelectedEmployees];
        return [[], () => { }];
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab !== "block") setSelectedBlocks([]);
        if (tab !== "village") setSelectedVillages([]);
        if (tab !== "employee") setSelectedEmployees([]);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !body.trim()) {
            alert("Please enter both title and body.");
            return;
        }

        const [selectedItems] = getSelectedByTab();
        if (selectedItems.length === 0) {
            alert("Please select at least one item!");
            return;
        }

        const selectedIds = selectedItems.map((item) => getId(item, activeTab));

        const formData = new FormData();
        formData.append("m12_nt_title", title);
        formData.append("m12_nt_body", body);
        formData.append("to", JSON.stringify(selectedIds));
        formData.append("to_name", activeTab === "block" ? "zone" : activeTab);
        if (image) formData.append("m12_nt_img", image);

        try {
            const res = await axiosInstance.post(API_URLS.send_notification_by_admin, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast(res?.data?.msg);
            if (res?.data?.success) {
                setTitle("");
                setBody("");
                setImage(null);
                setSelectedBlocks([]);
                setSelectedVillages([]);
                setSelectedEmployees([]);
                setActiveTab("block");
            }
        } catch {
            toast("Failed to send notification");
        }
    };

    const [selectedItems, setSelectedItems] = getSelectedByTab();

    return (
        <div className="mx-5">
            <h1 className="font-bold text-xl mb-4">Send Notification</h1>
            <div className="flex gap-4 mb-4">
                {["block", "village", "employee"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-8 py-4 rounded ${activeTab === tab ? "bg-[#00008b] text-white" : "bg-gray-200"}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-2 w-full mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Body"
                    className="border p-2 w-full mb-2"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mb-2"
                />
            </div>
            <div className="border p-4 rounded max-h-[400px] overflow-y-auto">
                <Autocomplete
                    multiple
                    options={getDataByTab()}
                    disableCloseOnSelect
                    getOptionLabel={(option) => getLabel(option, activeTab)}
                    value={selectedItems}
                    onChange={(event, newValue) => setSelectedItems(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} className="flex items-center">
                            <Checkbox
                                icon={<CheckBoxOutlineBlank fontSize="small" />}
                                checkedIcon={<CheckBox fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {getLabel(option, activeTab)}
                        </li>
                    )}
                    style={{ width: "100%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={`Select ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s`}
                            placeholder={`Search ${activeTab}s...`}
                        />
                    )}
                    isOptionEqualToValue={(option, value) =>
                        getId(option, activeTab) === getId(value, activeTab)
                    }
                />
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SendNotification;
