import { useFormik } from 'formik';
import React, { useState } from 'react';
import { AiFillLock, AiOutlineMail } from 'react-icons/ai';
import { API_URLS } from '../../config/APIUrls';
import CustomCircularProgress from '../../Shared/loder/CustomCircularProgress';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClientJS } from 'clientjs';
import { toast } from 'react-toastify';
import { ConstructionOutlined } from '@mui/icons-material';

const AdminLogIn = () => {
  const [loding, setloding] = useState(false);
  const navigate = useNavigate();
  const client = new ClientJS();
  const fingerprint = client.getFingerprint();
  const [showQR, setShowQR] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const initialValue = {
    username: '',
    password: '',
    finger_id: '',
  };

  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    onSubmit: () => {
      const reqBody = {
        username: fk.values.username,
        password: fk.values.password,
        lgn_type: 1,
        finger_id: String(fingerprint),
      };
      loginFunction(reqBody);
    },
  });

  const loginFunction = async (reqBody) => {
    setloding(true);
    try {
      const response = await axios.post(API_URLS.member_login, reqBody);
      toast(response?.data?.message);

      const result = response?.data?.result[0];

      if (result.qr_required) {
        setQrImage(result.qr);
        setTempUserId(result.temp_user); 
        setShowQR(true);
      }

      if (result.otp_required) {
        setTempUserId(result.temp_user); 
        setShowOTP(true);
      }

    } catch (e) {
      console.log(e);
    } finally {
      setloding(false);
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast("Please Enter 6 Digit OTP");
    }

    try {
      const response = await axios.post(API_URLS.verify_2fa, {
        otp: finalOtp,
        user_id: tempUserId
      });

      toast(response?.data?.message);

      if (response.data.success) {
        localStorage.setItem("token_admin", response.data.result[0].token);
        navigate("/admin_dashboard");
        window.location.reload();
      }
    } catch (err) {
      toast("Invalid OTP");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // next input focus
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };
  // const loginFunction = async (reqBody) => {
  //   setloding(true);
  //   try {
  //     const response = await axios.post(API_URLS.member_login, reqBody);
  //     toast(response?.data?.message);
  //     if (response?.data?.success) {
  //       localStorage.setItem('token', response?.data?.result?.[0]?.token);
  //       localStorage.setItem('type', response?.data?.result?.[0]?.user_type);
  //       navigate('/admin_dashboard');
  //       window.location.reload();
  //     }
  //   } catch (e) {
  //     console.log(e);

  //   } finally {
  //     setloding(false);
  //   }
  // };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-gray-200"

    >
      <CustomCircularProgress isLoading={loding} />

      <div className="bg-[#101928] backdrop-blur-md shadow-xl rounded-xl p-8 py-10 w-full max-w-md border border-white/20 ">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          Admin Login
        </h2>
        {!showQR && !showOTP ? (
          < form onSubmit={fk.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-white mb-1 ml-1">
                Username
              </label>
              <div className="flex items-center bg-white/20 border border-white/30 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                <input
                  type="text"
                  name="username"
                  value={fk.values.username}
                  onChange={fk.handleChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                />
                <div className="p-2 text-white/80">
                  <AiOutlineMail size={24} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white mb-1 ml-1">
                Password
              </label>
              <div className="flex items-center bg-white/20 border border-white/30 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                <input
                  type="password"
                  name="password"
                  value={fk.values.password}
                  onChange={fk.handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
                />
                <div className="p-2 text-white/80">
                  <AiFillLock size={24} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-t from-[#1E3C94] to-[#7D85FE] text-white py-2 rounded-full font-semibold shadow-md transition-all duration-200"
            >
              Login Now
            </button>
            <p
              className="text-[#fff] p-2 mt-2 text-xs text-end cursor-pointer underline"
              onClick={() => navigate('/sign_up')}
            >
              SignUp
            </p>
          </form>
        ) : showQR && !showOTP ? (
          <div className="text-center text-white mt-6">
            <h3 className="text-lg mb-4">Scan QR Code</h3>
            <img src={qrImage} alt="QR Code" className="mx-auto w-48 h-48 bg-white p-2" />
            <p className="text-sm mt-3">Scan with Google Authenticator</p>
            <button
              onClick={() => setShowOTP(true)}
              className="mt-4 bg-blue-600 px-6 py-2 rounded"
            >
              Continue
            </button>
          </div>
        ) : showOTP ? (
          <div className="mt-6 text-center">
            <label className="text-white text-sm">Enter OTP</label>
            <div className="flex justify-center gap-2 mt-3">
              {otp.map((data, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    placeholder='*'
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-12 text-center text-xl rounded bg-white/20 text-white outline-none border border-white/30"
                  />
                );
              })}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full mt-5 bg-blue-600 py-2 rounded text-white"
            >
              Verify OTP
            </button>
          </div>
        ) : null}
      </div>
    </div >
  );

};

export default AdminLogIn;
