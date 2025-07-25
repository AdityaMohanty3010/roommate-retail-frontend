import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../services/cartservice";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultAmount = location.state?.amount || "";
  const [amount, setAmount] = useState(defaultAmount);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [details, setDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    bankName: "",
  });

  useEffect(() => {
    if (!location.state?.amount) {
      setMessage("⚠️ No amount received from cart. Please enter manually.");
    }
  }, [location.state]);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("❌ Please enter a valid amount.");
      return;
    }

    if (paymentMethod === "card") {
      const cardDigits = details.cardNumber.replace(/\s/g, "");
      const expiryValid = /^\d{2}\/\d{2}$/.test(details.expiry);
      const cvvValid = /^\d{3}$/.test(details.cvv);

      if (cardDigits.length !== 16 || !expiryValid || !cvvValid) {
        setMessage("❌ Please enter valid card details.");
        return;
      }
    }

    if (paymentMethod === "upi" && !details.upiId.includes("@")) {
      setMessage("❌ Please enter a valid UPI ID.");
      return;
    }

    if (paymentMethod === "netbanking" && !details.bankName.trim()) {
      setMessage("❌ Please enter your bank name.");
      return;
    }

    setMessage("🔄 Processing payment...");

    setTimeout(async () => {
      await clearCart();
      setMessage("✅ Payment Successful!");
      setTimeout(() => navigate("/dashboard"), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Payment</h2>

        {/* Amount Label and Input */}
        <label className="block mb-1 text-sm text-gray-300">Total Amount (₹):</label>
        <input
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Payment Method */}
        <label className="block mb-2 text-sm text-gray-300">Choose Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
        >
          <option value="card">💳 Card</option>
          <option value="upi">📱 UPI</option>
          <option value="netbanking">🏦 Net Banking</option>
        </select>

        {/* Conditional Inputs */}
        {paymentMethod === "card" && (
          <>
            <input
              type="text"
              placeholder="Card Number (XXXX XXXX XXXX XXXX)"
              value={details.cardNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const formatted = raw.match(/.{1,4}/g)?.join(" ").substr(0, 19) || "";
                setDetails({ ...details, cardNumber: formatted });
              }}
              maxLength={19}
              className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={details.expiry}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d/]/g, "");
                  const formatted = val.length === 2 && !val.includes("/") ? val + "/" : val;
                  setDetails({ ...details, expiry: formatted.slice(0, 5) });
                }}
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="password"
                placeholder="CVV"
                value={details.cvv}
                maxLength={3}
                onChange={(e) =>
                  setDetails({ ...details, cvv: e.target.value.replace(/\D/g, "") })
                }
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </>
        )}

        {paymentMethod === "upi" && (
          <input
            type="text"
            placeholder="UPI ID (e.g. name@bank)"
            value={details.upiId}
            onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
            className="w-full p-3 mb-4 mt-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        )}

        {paymentMethod === "netbanking" && (
          <input
            type="text"
            placeholder="Bank Name"
            value={details.bankName}
            onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
            className="w-full p-3 mb-4 mt-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        )}

        {/* Pay Now Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition mt-4"
        >
          🔐 Pay Now
        </button>

        {/* Message */}
        {message && <p className="mt-4 text-center text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentPage;
