"use client";
import styles from "./AadharVerification.module.css";
import { useState, ChangeEvent ,useEffect} from "react";
import OtpInput from "react-otp-input";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const AadharVerification: React.FC = () => {
    const [aadharNumber, setAadharNumber] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [aadharError, setAadharError] = useState<string>("");
    const [referenceId,setReferenceId] = useState<string | null>("");
    const [otpError, setOtpError] = useState<string>(""); 
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const router = useRouter();


    useEffect(() => {
        // Cleanup function
        return () => {
            sessionStorage.removeItem("aadhaarReferenceId");
        };
    }, []);
    const validateAadhar = (aadhar: string): boolean => {
        // Basic Aadhar number validation (12 digits)
        const re = /^[0-9]{12}$/;
        return re.test(aadhar);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newAadhar = e.target.value;
        setAadharNumber(newAadhar);
        setAadharError(""); // Clear error when user types
    };

    const sendAadharOtp = async () => {
        if (!validateAadhar(aadharNumber)) {
            setAadharError("Please enter a valid 12-digit Aadhar number");
            return;
        }

        try {
            setLoading(true);
            sessionStorage.removeItem("aadhaarReferenceId");
            setReferenceId(null);
            const response = await axios.post(
                "http://localhost:5000/api/users/send-aadhar-otp",
                { aadharNumber }
            );
            if (response.data.success) {
                console.log(response);
                
                const newReferenceId = response.data.ref_id;
                // Store in component state
                setReferenceId(newReferenceId);
                // Store in sessionStorage for persistence across page reloads
                sessionStorage.setItem("aadhaarReferenceId", newReferenceId);
                toast.success("OTP sent successfully");
                setShowOTP(true); 
              
            } else if (!response.data.success) {
                toast.error(response.data.message);
            } else {
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const onOTPVerify = async () => {
         if (!otp) {
            setOtpError("OTP field can't be empty");
            return;
         }
        setLoading(true);
        const userId= localStorage.getItem('userId')
        const storedReferenceId = sessionStorage.getItem('aadhaarReferenceId') || referenceId;
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/verify-aadhar-otp",
                {
                    otp,
                    referenceId: storedReferenceId,
                    userId
                }
            );
                console.log(response.data.data.message)
            if (response.data.success) {
                setIsVerified(true);
                toast.success("Aadhar verified successfully");
                sessionStorage.removeItem('aadhaarReferenceId');
                setTimeout(() => {
                    router.push('/register/pancard');
                }, 1200); 
             
            } else {  
                 toast.error(
                    response.data.data.message || 'invalid otp,try again'
                );
            }
        } catch (error:any) {
            console.error(error)
           toast.error(error.response.data.message||"some error occured")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Toaster toastOptions={{ duration: 1200 }} />
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Aadhar Verification</h1>
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
                                        disabled={isVerified}
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
                        {otpError && <div className={styles.errorMessage}>{otpError}</div>}

                        <div className={styles.buttonContainer}>
                            <button
                                onClick={onOTPVerify}
                                disabled={loading || isVerified}
                                className={styles.button}
                            >
                                {loading ? (<>
                                  verifying  <ClipLoader
                                        color={"#ffffff"}
                                        loading={loading}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    /></>
                                )  : isVerified ? (
                                    <span>Verified</span>
                                ) : (
                                    <span>Verify OTP</span>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className={styles.label}>
                            Enter your Aadhar Number
                        </label>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Aadhar Number"
                                name="aadharNumber"
                                required
                                value={aadharNumber}
                                onChange={handleChange}
                                disabled={loading}
                                maxLength={12}
                            
                            />
                        </div>
                        {aadharError && (
                            <div className={styles.errorMessage}>
                                {aadharError}
                            </div>
                        )}
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={sendAadharOtp}
                                className={styles.button}
                                disabled={loading}
                            >
                                {loading ? (<>
                                 sending email otp   <ClipLoader
                                        color={"#ffffff"}
                                        loading={loading}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    /></>
                                ) : (
                                    <span>Send OTP</span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AadharVerification;
