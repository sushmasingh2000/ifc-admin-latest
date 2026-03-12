import { useEffect, useState } from "react";
import { API_URLS } from "../../../../config/APIUrls";
import axiosInstance from "../../../../config/axios";
import CustomTable from "../../../../Shared/CustomTable";
import CustomToPagination from "../../../../Shared/CustomToPagination";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { FilterAlt } from "@mui/icons-material";



const SpotHistory = () => {
    const [loding, setloding] = useState(false);
    const [data, setData] = useState([]);
    const [from_date, setFrom_date] = useState("");
    const [to_date, setTo_date] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const SpotHistoryFn = async () => {
        setloding(true);
        try {
            const res = await axiosInstance.post(API_URLS?.get_report_details, {
                start_date: from_date,
                end_date: to_date,
                search: search,
                page: page,
                count: 10,
                sub_label: "SPOT WALLET",
                main_label: "ALL",
            });
            if (res?.data?.result) {
                setData(res.data.result);
                setTo_date("");
                setFrom_date("");
            }
        } catch (e) {
            console.log(e);
        }
        setloding(false);
    };

    useEffect(() => {
        SpotHistoryFn();
    }, [page]);

    const tablehead = [
        <span>S.No.</span>,
        <span>Transaction ID</span>,
        <span>Amount</span>,
        <span>Date/Time</span>,
        <span>Description</span>,
    ];

    const tablerow = data?.data?.map((i, index) => {
        return [
            <span>{(page - 1) * 10 + index + 1}</span>,
            <span>{i.tr07_trans_id}</span>,
            <span>{Number(i.tr07_tr_amount).toFixed(2)}</span>,
            <span>{moment(i.tr07_created_at).format("DD-MM-YYYY HH:mm:ss")}</span>,
            <span>{i.tr07_description}</span>,
        ];
    });

    return (
        <div className="bg-white shadow-lg p-4 px-5 flex flex-col ">
            <p className="text-xl font-bold mb-3">Spot History</p>
            <div className="flex flex-wrap gap-4 items-center mb-4">
                <span className="font-bold">From:</span>
                <TextField
                    type="date"
                    value={from_date}
                    onChange={(e) => setFrom_date(e.target.value)}
                    size="small"
                />

                <span className="font-bold">To:</span>
                <TextField
                    type="date"
                    value={to_date}
                    onChange={(e) => setTo_date(e.target.value)}
                    size="small"
                />

                <TextField
                    type="search"
                    placeholder="Search by user id"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />

                <Button
                    onClick={() => {
                        setPage(1);
                        SpotHistoryFn();
                    }}
                    variant="contained"
                    startIcon={<FilterAlt />}
                >
                    Filter
                </Button>
            </div>
            <div className="flex-1 overflow-auto">
                <CustomTable
                    tablehead={tablehead}
                    tablerow={tablerow}
                    isLoading={loding}
                />
            </div>
            <div className="mt-3">
                <CustomToPagination setPage={setPage} page={page} data={data} />
            </div>
        </div>
    );
};

export default SpotHistory