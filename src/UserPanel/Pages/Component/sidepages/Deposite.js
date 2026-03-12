import { ethers } from "ethers";
import { useFormik } from "formik";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_URLS } from "../../../../config/APIUrls";
import axiosInstance from "../../../../config/axios";
import { enCryptData } from "../../../../Shared/secret";

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];
const RECEIVER_ADDRESS = "0x2583fdfd4319bb44f0afc6a706440858174593f8";


const DepositeModal = ({ open, setOpen }) => {

  const [walletAddress, setWalletAddress] = useState("");
  const [no_of_Tokne, setno_of_Tokne] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [receiptStatus, setReceiptStatus] = useState("");
  const [bnb, setBnb] = useState("");
  const [gasprice, setGasPrice] = useState("");
  const [loding, setLoding] = useState(false);
  const client = useQueryClient();
  const fk = useFormik({
    initialValues: {
      inr_value: "",
      m_pack_id: "",
    },
  });

  if (!open) return null;

  async function requestAccount() {
    setLoding(true);
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAccount = accounts[0];
        setWalletAddress(userAccount);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const nativeBalance = await provider.getBalance(userAccount);
        setBnb(ethers.utils.formatEther(nativeBalance));
        const tokenContract = new ethers.Contract(
          "0x55d398326f99059fF775485246999027B3197955",
          tokenABI,
          provider
        );
        const tokenBalance = await tokenContract.balanceOf(userAccount);
        setno_of_Tokne(ethers.utils.formatUnits(tokenBalance, 18));
      } catch (error) {
        console.log(error);
        toast("Error connecting...", error);
      }
    } else {
      toast("MetaMask not detected.");
    }
    setLoding(false);
  }
  async function sendTokenTransaction() {
    if (!walletAddress) return toast("Plese Connect your wallet.");
    if (!fk.values.inr_value) return toast("Please Enter Amount")
    if (fk.values.inr_value < 10) {
      return toast("Please Enter Amount Minimum 10");
    }
    if (
      Number(no_of_Tokne) <
      Number(Number(fk.values.inr_value).toFixed(6))
    ) {
      setLoding(false);
      return toast("Insufficient token balance");
    }

    setLoding(true);

    if (!window.ethereum) {
      toast("MetaMask not detected");
      setLoding(false);
      return;
    }
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }], 
    });
    const lastId = await PayinZpDummy();
    const last_id = lastId?.result?.[0]?.last_id || 0
    if (!last_id) {
      setLoding(false);
      return toast("Please refresh your page!")
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const tokenAmount = ethers.utils.parseUnits(
        String(Number(fk.values.inr_value).toFixed(6)),
        18
      );

      const tokenContract = new ethers.Contract(
        "0x55d398326f99059fF775485246999027B3197955",
        tokenABI,
        signer
      );

      const gasPrice = await provider.getGasPrice();

      const gasEstimate = await tokenContract.estimateGas.transfer(
        RECEIVER_ADDRESS,
        tokenAmount
      );

      const totalGasCost = gasEstimate.mul(gasPrice);
      setGasPrice(ethers.utils.formatEther(totalGasCost));

      const bnbBalance = await provider.getBalance(await signer.getAddress());

      if (bnbBalance.lt(totalGasCost)) {
        setLoding(false);
        return toast(
          `Insufficient BNB. Need ${ethers.utils.formatEther(totalGasCost)} BNB`
        );
      }

      const tx = await tokenContract.transfer(
        RECEIVER_ADDRESS,
        tokenAmount
      );

      const receipt = await tx.wait();

      setTransactionHash(tx.hash);
      setReceiptStatus(receipt.status === 1 ? "Success" : "Failure");

      if (receipt.status === 1) {
        PayinZp(
          last_id,
          ethers.utils.formatEther(totalGasCost),
          tx.hash,
          2
        );
      } else {
        PayinZp(
          last_id,
          ethers.utils.formatEther(totalGasCost),
          tx.hash,
          3
        );
      }


    } catch (error) {
      console.log(error);
      toast("Token transaction failed", error);
    }
    setLoding(false);
  }

  async function PayinZp(last_id, gasPrice, tr_hash, status) {

    const reqbody = {
      last_id: last_id,
      userid: "1",
      req_token: Number(fk.values.inr_value),
      market_price: Number(1),
      u_user_wallet_address: walletAddress,
      u_transaction_hash: tr_hash,
      u_trans_status: status,
      currentBNB: bnb,
      currentZP: no_of_Tokne,
      gas_price: gasPrice,
      pkg_id: "",
    };
    try {
      const res = await axiosInstance.post(API_URLS?.paying_request, {
        payload: enCryptData(reqbody),
      });
      toast(res?.data?.msg);
      client.refetchQueries("wallet_amount_amount");
      client.refetchQueries("wallet_amount");
      fk.handleReset();
      setLoding(false);
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  async function PayinZpDummy() {
    const reqbody = {
      userid: "1",
      req_token: Number(fk.values.inr_value),
      market_price: Number(1),
      u_user_wallet_address: walletAddress,
      u_transaction_hash: "xxxxxxxxxx",
      u_trans_status: 1,
      currentBNB: bnb,
      currentZP: no_of_Tokne,
      gas_price: "",
      pkg_id: "",
    };

    try {
      const res = await axiosInstance.post(API_URLS?.paying_dummy, {
        payload: enCryptData(reqbody),
      });
      // toast(res?.data?.message)
      return res?.data;
    } catch (e) {
      console.log(e);
    }
  }

  // ================= UI (UNCHANGED) =================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Deposite</h2>
          <button onClick={() => setOpen(false)}>
            <HiX size={22} />
          </button>
        </div>

        <button
          onClick={requestAccount}
          className="w-full mb-3 bg-black text-white py-2 rounded-full"
        >
          Connect Wallet
        </button>
        <label className="text-sm text-slate-600"> </label>
        <div className="border rounded-lg px-4 py-3 mt-1 mb-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">USD (US Dollar)</span>
            <span className="text-slate-500"></span>
          </div>
        </div>

        {walletAddress && (
          <>
            <label className="text-sm text-slate-600"> Address</label>
            <div className="border text-xs rounded-lg px-4 py-3 text-[#5e59eb] bg-slate-50 mb-6">
              {walletAddress}
            </div>
          </>
        )}
        <label className="text-sm text-slate-600">Amount</label>
        <input
          type="number"
          name="inr_value"
          value={fk.values.inr_value}
          onChange={fk.handleChange}
          placeholder="Enter amount"
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#5e59eb]"
        />

        <button
          onClick={sendTokenTransaction}
          disabled={loding}
          className="w-full bg-[#5e59eb] text-white py-2 rounded-lg font-medium hover:opacity-90 mb-4"
        >
          {loding ? "Processing..." : "Deposit funds"}
        </button>

        <div className="flex flex-col gap-1 justify-between">
          <label className="text-sm text-slate-600 "> Transaction</label>
          {transactionHash}

          <label className="text-sm text-slate-600"> Reciept </label>
          {receiptStatus}

          <label className="text-sm text-slate-600"> GasPrice</label>
          {gasprice}
        </div>
      </div>
    </div>
  );
};

export default DepositeModal;
