import {
    Button,
    TextField,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "../config/APIUrls";
import axiosInstance from "../config/axios";
import CustomCircularProgress from "../Shared/loder/CustomCircularProgress";

const WalletAddress = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [walletaddress, setWalletAddress] = useState("");


    const fk = useFormik({
        initialValues: {
            customer_id: "",
            wallet_address: "",
        },
    });

    /* ================= MEMBER NAME FETCH ================= */

    const MemberCustFn = async () => {
        if (!fk.values.customer_id) {
            setName("");
            setWalletAddress("")
            return;
        }
        try {
            const res = await axiosInstance.post(
                API_URLS.member_name_cust_id,
                { customer_id: fk.values.customer_id }
            );

            const customerName = res?.data?.result?.[0]?.lgn_name;
            setName(customerName || "User not found");
            setWalletAddress(res?.data?.result?.[0]?.lgn_wallet_add || "Address Not Avialble")
        } catch {
            setName("Invalid User ID");
        }
    };

    useEffect(() => {
        MemberCustFn();
    }, [fk.values.customer_id]);

    /* ================= SEND OTP ================= */

    const WalletUpdate = async () => {
        if (!fk.values.customer_id || !fk.values.wallet_address) {
            return toast.error("Fill all fields first");
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(API_URLS.change_member_profile, {
                customer_id: fk.values.customer_id,
                wallet_address: fk.values.wallet_address,
            });
            toast(res?.data?.message);
            if (res?.data?.success) {
                fk.handleReset();
            }
        } catch {
            console.log(" address failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <CustomCircularProgress isLoading={loading} />

            <div
                style={{
                    padding: 25,
                    width: "100%",
                    maxWidth: 450,
                    background: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    borderRadius: 10,
                }}
            >
                <Typography variant="h6" align="center" fontWeight="bold" mb={3}>
                    Wallet Address Update
                </Typography>


                <TextField
                    label="User ID"
                    name="customer_id"
                    value={fk.values.customer_id}
                    onChange={fk.handleChange}
                    fullWidth
                    margin="normal"
                />

                {name && (
                    <Typography color="green" fontSize="14px">
                        {name}
                    </Typography>
                )}

                {walletaddress && (
                    <>
                        <TextField
                            label="Old Wallet Adress "
                            name="wallet_address"
                            value={walletaddress}
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}


                <TextField
                    label="New Wallet Adress "
                    name="wallet_address"
                    value={fk.values.wallet_address}
                    onChange={fk.handleChange}
                    fullWidth
                    margin="normal"
                />


                <Button
                    fullWidth
                    onClick={WalletUpdate}
                    sx={{
                        mt: 3,
                        background: "#00008b",
                        color: "#fff",
                        fontWeight: 600,
                        "&:hover": { background: "#2d64dd" },
                    }}
                >
                    Update                </Button>


            </div>
        </div>
    );
};

export default WalletAddress;
