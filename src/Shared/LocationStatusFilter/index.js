import { FileDownload, FilterAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useQuery } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";

const LocationStatusFilter = ({
    showDistrict = false,
    showZone = false,
    showVillage = false,
    showStatus = false,
    filters,
    setFilters,
    onApply,
    onClear,
    onExport
}) => {

    const handleChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Master API Calls
    const { data: districtData } = useQuery(
        "get_district_master",
        () => axiosInstance.get(API_URLS.get_district_master, { params: { count: 1000000, status: "1" }}),
        { enabled: showDistrict }
    );

    const { data: zoneData } = useQuery(
        ["get_zone_master", filters.district],
        () => axiosInstance.get(API_URLS.get_zone_master, { params: { count: 1000000, status: "1" }}),
        { enabled: showZone }
    );

    const { data: villageData } = useQuery(
        ["get_village_master", filters.zone],
        () => axiosInstance.get(API_URLS.get_village_master, { params: { count: 1000000, status: "1"}}),
        { enabled: showVillage }
    );

    const districtOptions = districtData?.data?.response?.data || [];
    const zoneOptions = zoneData?.data?.response?.data || [];
    const villageOptions = villageData?.data?.response?.data || [];

    const statusOptions = [
        "Pending", "Approved", "Rejected", "Cancelled",
        "Active", "Deactive", "Resigned", "Attendance Blocked"
    ];

    return (
        <div className="flex flex-wrap gap-3 p-3 bg-[#EBE9FD] rounded">

            {showDistrict && (
                <select name="district" value={filters.district} onChange={handleChange} className="border px-2 py-1 rounded">
                    <option value="">All Districts</option>
                    {districtOptions.map(d => <option key={d.m04_dist_id} value={d.m04_dist_id}>{d.m04_dist_name}</option>)}
                </select>
            )}

            {showZone && (
                <select name="zone" value={filters.zone} onChange={handleChange} className="border px-2 py-1 rounded">
                    <option value="">All Blocks</option>
                    {zoneOptions.map(z => <option key={z.m05_zn_id} value={z.m05_zn_id}>{z.m05_zn_name}</option>)}
                </select>
            )}

            {showVillage && (
                <select name="village" value={filters.village} onChange={handleChange} className="border px-2 py-1 rounded">
                    <option value="">All Villages</option>
                    {villageOptions.map(v => <option key={v.m06_vi_id} value={v.m06_vi_id}>{v.m06_vi_name}</option>)}
                </select>
            )}

            {showStatus && (
                <select name="status" value={filters.status} onChange={handleChange} className="border px-2 py-1 rounded">
                    <option value="">All Status</option>
                    {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            )}

            <Button variant="contained" startIcon={<FilterAlt />} onClick={onApply}>Filter</Button>
            <Button variant="outlined" color="secondary" onClick={onClear}>Clear</Button>
            <Button variant="contained" color="success" startIcon={<FileDownload />} onClick={onExport}>Export</Button>

        </div>
    );
};

export default LocationStatusFilter;
