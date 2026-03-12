import { useFormik } from 'formik';
import React, { useState } from 'react';
import { AiFillLock, AiOutlineMail } from 'react-icons/ai';
import { API_URLS } from '../../config/APIUrls';
import CustomCircularProgress from '../../Shared/loder/CustomCircularProgress';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Group, MobileOff, Person, Support } from '@mui/icons-material';

const SignUp = () => {
    const [loding, setloding] = useState(false);
    const navigate = useNavigate();
    const initialValue = {
        full_name: '',
        email: '',
        mobile: '',
        password: '',
        referral_id: '',
    };

    const fk = useFormik({
        initialValues: initialValue,
        enableReinitialize: true,
        onSubmit: () => {
            const reqBody = {
                full_name: fk.values.full_name,
                email: fk.values.email,
                mobile: fk.values.mobile,
                referral_id: fk.values.referral_id,
                password: fk.values.password,
            };
            RegFunction(reqBody);
        },
    });

    const RegFunction = async (reqBody) => {
        setloding(true);
        try {
            const response = await axios.post(API_URLS.member_registration, reqBody);
            toast(response?.data?.message);
            // if (response?.data?.success) {
            //     localStorage.setItem('token', response?.data?.response?.[0]?.token);
            //     localStorage.setItem('type', response?.data?.response?.[0]?.login_type);
            //     navigate('/dashboard');
            //     window.location.reload();

            // }
        } catch (e) {
            console.log(e);

        } finally {
            setloding(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center"
            style={{
                backgroundImage: "linear-gradient(242deg, #5e59eb, #101928)"
            }}
        >
            <CustomCircularProgress isLoading={loding} />

            <div className="bg-[#101928] backdrop-blur-md shadow-xl rounded-xl p-8 py-10 w-full max-w-xl border border-white/20 ">
                <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
                    Registration  </h2>
                <form
                    onSubmit={fk.handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4"
                >
                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-white mb-1 ml-1">
                            Full Name
                        </label>
                        <div className="flex items-center bg-white/20 border border-white/30 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="text"
                                name="full_name"
                                value={fk.values.full_name}
                                onChange={fk.handleChange}
                                placeholder="Enter your Full Name"
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                            />
                            <div className="p-2 text-white/80">
                                <Person />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="w-full">
                        <label className="block text-sm text-white mb-1 ml-1">
                            Email
                        </label>
                        <div className="flex items-center bg-white/20 border border-white/30 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="email"
                                name="email"
                                value={fk.values.email}
                                onChange={fk.handleChange}
                                placeholder="Enter your Email"
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                            />
                            <div className="p-2 text-white/80">
                                <AiOutlineMail size={22} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="w-full">
                        <label className="block text-sm text-white mb-1 ml-1">
                            Mobile
                        </label>
                        <div className="flex items-center bg-white/20 border border-white/30 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="tel"
                                name="mobile"
                                value={fk.values.mobile}
                                onChange={fk.handleChange}
                                placeholder="Enter your Mobile"
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                            />
                            <div className="p-2 text-white/80">
                                <MobileOff />
                            </div>
                        </div>
                    </div>

                    {/* Referral */}
                    <div className="w-full">
                        <label className="block text-sm text-white mb-1 ml-1">
                            Referral ID
                        </label>
                        <div className="flex items-center bg-white/20 border border-white/30 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="text"
                                name="referral_id"
                                value={fk.values.referral_id}
                                onChange={fk.handleChange}
                                placeholder="Referral"
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                            />
                            <div className="p-2 text-white/80">
                                <Group />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="w-full">
                        <label className="block text-sm text-white mb-1 ml-1">
                            Password
                        </label>
                        <div className="flex items-center bg-white/20 border border-white/30 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="password"
                                name="password"
                                value={fk.values.password}
                                onChange={fk.handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                            />
                            <div className="p-2 text-white/80">
                                <AiFillLock size={22} />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-t from-[#1E3C94] to-[#7D85FE] text-white py-2.5 rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-[1.02]"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                <p
                    className="text-[#fff] p-2 mt-2 text-xs text-end cursor-pointer underline"
                    onClick={() => navigate('/')}
                >
                    Login
                </p>
            </div>
        </div>
    );

};

export default SignUp;
