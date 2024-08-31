"use client";
import styles from "./EmailRegistration.module.css";
import { useState, ChangeEvent } from "react";
import OtpInput from "react-otp-input";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios"; // Make sure to install axios: npm install axios
import { setDefaultAutoSelectFamily } from "net";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const EmailRegistration: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");
    const [token, setToken] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(""); // Clear error when user types
    };

    const sendEmailOtp = async () => {
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/send-email-otp",
                { email }
            );
            if (response.data.success) {
                console.log(response);
                setShowOTP(true);
                // storing the token in local storage
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                toast.success("otp send successfully");
            } else {
                setEmailError("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setEmailError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const onOTPVerify = async () => {
        if (!token) {
            setEmailError("Session expired. Please request a new OTP.");
            toast.error("Session expired. Please request a new OTP.");
            return;
        }

        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.post(
                "http://localhost:5000/api/users/verify-email-otp",
                {
                    otp,
                    token,
                    userId,
                }
            );

            if (response.data.success) {
                localStorage.removeItem("token");
                setIsVerified(true);
                toast.success("OTP verified successfully");
                setTimeout(() => {
                    router.push("/verify/aadhar");
                }, 1200);
            } else {
                // This block will likely never execute because axios throws an error for non-2xx responses
                setEmailError(
                    response.data.message || "Invalid OTP. Please try again."
                );
                toast.error(
                    response.data.message || "Invalid OTP. Please try again."
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The server responded with a status code outside the 2xx range

                    toast.error(
                        error.response.data.message ||
                            "Invalid OTP. Please try again."
                    );
                } else if (error.request) {
                    // The request was made but no response was received

                    toast.error("No response from server. Please try again.");
                } else {
                    // Something happened in setting up the request that triggered an Error

                    toast.error("An error occurred. Please try again later.");
                }
            } else {
                // Non-Axios error

                toast.error(
                    "An unexpected error occurred. Please try again later."
                );
            }
            console.error("Error verifying OTP:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Toaster toastOptions={{ duration: 1200 }} />
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Email verification</h1>
                {showOTP ? (
                    <>
                        <label htmlFor="otp" className={styles.label}>
                            Enter your OTP
                        </label>
                        <div className={styles.otpContainer}>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span> </span>}
                                shouldAutoFocus={true}
                                inputStyle={styles.OtpContainer}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "10px",
                                            fontSize: "16px",
                                            width: "20px",
                                            textAlign: "center",
                                            marginRight: "5px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={onOTPVerify}
                                className={styles.button}
                                disabled={loading || isVerified}
                            >
                                {loading ? (
                                    <ClipLoader
                                        color={"#ffffff"}
                                        loading={loading}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                ) : isVerified ? (
                                  <span>Verified</span>
                                ) : (
                                  <span>Verify OTP</span>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className={styles.label}>Enter your email</label>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                placeholder="email"
                                name="email"
                                required
                                value={email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        {emailError && (
                            <p className={styles.errorMessage}>{emailError}</p>
                        )}
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={sendEmailOtp}
                                className={styles.button}
                                disabled={loading}
                            >
                                {loading ? ( <>
                                  sending otp  <ClipLoader
                                        color={"#ffffff"}
                                        loading={loading}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                               </> ) : (
                                    <span>Send code via Email</span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailRegistration;
