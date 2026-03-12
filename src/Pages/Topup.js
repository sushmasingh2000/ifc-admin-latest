import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URLS, email_for_topup } from "../config/APIUrls";
import axiosInstance from "../config/axios";
import { useEffect, useState } from "react";
import CustomCircularProgress from "../Shared/loder/CustomCircularProgress";

const AdminTopUp = () => {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(Array(6).fill(""));

    const fk = useFormik({
        initialValues: {
            user_id: "",
            pkg_amount: "",
            wallet_type: "fund_wallet",
        },
    });

    /* ================= MEMBER NAME FETCH ================= */

    const MemberCustFn = async () => {
        if (!fk.values.user_id) {
            setName("");
            return;
        }
        try {
            const res = await axiosInstance.post(
                API_URLS.member_name_cust_id,
                { customer_id: fk.values.user_id }
            );

            const customerName = res?.data?.result?.[0]?.lgn_name;
            setName(customerName || "User not found");
        } catch {
            setName("Invalid User ID");
        } 
    };

    useEffect(() => {
        MemberCustFn();
    }, [fk.values.user_id]);

    /* ================= SEND OTP ================= */

    const emailOtp = async () => {
        if (!fk.values.user_id || !fk.values.pkg_amount) {
            return toast.error("Fill all fields first");
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(API_URLS.send_otp, {
                useremail: email_for_topup,
                type: "topup",
            });
            toast(res?.data?.message);
            if (res?.data?.success) {
                setStep(2);
            }
        } catch {
            console.log("OTP send failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= VERIFY OTP + FINAL TOPUP ================= */

    const verifyOtp = async () => {
        if (otp.join("").length !== 6) {
            return toast.error("Enter complete 6 digit OTP");
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(API_URLS.verify_otp, {
                useremail: email_for_topup,
                otp: otp.join(""),
            });

            if (res?.data?.success) {
                const topupRes = await axiosInstance.post(
                    API_URLS.member_topup_by_admin,
                    fk.values
                );

                // toast(res?.data?.message);
                const mergedMessage = [res?.data?.message, topupRes?.data?.message]
                    .filter(Boolean) // remove empty/null messages
                    .join(" | ");    // separator, aap chahein to "\n" bhi use kar sakte ho

                toast(mergedMessage);
                queryClient.invalidateQueries("get_members");

                // Reset
                fk.resetForm();
                setOtp(Array(6).fill(""));
                setStep(1);
                setName("");
            }
        } catch {
            console.log("OTP verification failed");
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
                    Admin Top-Up
                </Typography>

                {/* ================= FORM (Always Visible) ================= */}

                <FormControl disabled={step === 2}>
                    <RadioGroup
                        row
                        name="wallet_type"
                        value={fk.values.wallet_type}
                        onChange={fk.handleChange}
                    >
                        <FormControlLabel
                            value="fund_wallet"
                            control={<Radio />}
                            label="Trade Wallet"
                        />
                        <FormControlLabel
                            value="spot_wallet"
                            control={<Radio />}
                            label="Spot Wallet"
                        />
                    </RadioGroup>
                </FormControl>

                <TextField
                    label="User ID"
                    name="user_id"
                    value={fk.values.user_id}
                    onChange={fk.handleChange}
                    fullWidth
                    margin="normal"
                    disabled={step === 2}
                />

                {name && (
                    <Typography color="green" fontSize="14px">
                        {name}
                    </Typography>
                )}

                <TextField
                    type="number"
                    label="Package Amount"
                    name="pkg_amount"
                    value={fk.values.pkg_amount}
                    onChange={fk.handleChange}
                    fullWidth
                    margin="normal"
                    disabled={step === 2}
                />

                {/* Show Send OTP button only in Step 1 */}
                {step === 1 && (
                    <Button
                        fullWidth
                        onClick={emailOtp}
                        sx={{
                            mt: 3,
                            background: "#00008b",
                            color: "#fff",
                            fontWeight: 600,
                            "&:hover": { background: "#2d64dd" },
                        }}
                    >
                        Send OTP
                    </Button>
                )}

                {/* ================= OTP SECTION (Only After Send OTP) ================= */}

                {step === 2 && (
                    <>
                        <Typography align="center" mt={1}>
                            Enter 6 Digit OTP
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                                mt: 2,
                            }}
                        >
                            {otp.map((digit, index) => (
                                <TextField
                                    key={index}
                                    value={digit}
                                    placeholder="*"
                                    id={`otp-${index}`}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");

                                        if (!value) return;

                                        const newOtp = [...otp];
                                        newOtp[index] = value[0];
                                        setOtp(newOtp);

                                        // Move forward
                                        if (index < 5) {
                                            document.getElementById(`otp-${index + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace") {
                                            e.preventDefault();

                                            const newOtp = [...otp];

                                            // If current box has value → clear it
                                            if (newOtp[index]) {
                                                newOtp[index] = "";
                                                setOtp(newOtp);
                                            }
                                            // If empty → move backward
                                            else if (index > 0) {
                                                newOtp[index - 1] = "";
                                                setOtp(newOtp);
                                                document
                                                    .getElementById(`otp-${index - 1}`)
                                                    ?.focus();
                                            }
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();

                                        const pasteData = e.clipboardData
                                            .getData("text")
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                        if (!pasteData) return;

                                        const newOtp = Array(6).fill("");

                                        for (let i = 0; i < pasteData.length; i++) {
                                            newOtp[i] = pasteData[i];
                                        }

                                        setOtp(newOtp);

                                        // Focus last filled box
                                        const lastIndex = Math.min(pasteData.length - 1, 5);
                                        document
                                            .getElementById(`otp-${lastIndex}`)
                                            ?.focus();
                                    }}
                                    inputProps={{
                                        maxLength: 1,
                                        style: {
                                            textAlign: "center",
                                            width: 45,
                                            height: 45,
                                            fontSize: "18px",
                                        },
                                    }}
                                />
                            ))}
                        </Box>


                        <Button
                            fullWidth
                            onClick={verifyOtp}
                            sx={{
                                mt: 4,
                                background: "#00008b",
                                color: "#fff",
                                fontWeight: 600,
                                "&:hover": {
                                    background: "#2d64dd",
                                },
                            }}
                        >
                            Verify & Complete Topup
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTopUp;
