import React, { useState, ChangeEvent } from "react";
import styles from "./BankAccountVerification.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormInput {
    ifsc: string;
    accNo: string;
}

interface FormError {
    ifsc: string;
    accNo: string;
}

const BankAccountVerification: React.FC = () => {
    const [formInput, setFormInput] = useState<FormInput>({
        ifsc: "",
        accNo: "",
    });
    const [error, setError] = useState<FormError>({
        ifsc: "",
        accNo: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const verifyAcc = async () => {
        if (!validateAccNo(formInput.accNo)) {
            setError((prev) => ({
                ...prev,
                accNo: "Account number must contain only numbers",
            }));
        }

        if (!validateIfscCode(formInput.ifsc)) {
            setError((prev) => ({ ...prev, ifsc: "Invalid IFSC code" }));
            return;
        }

        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.post(
                "http://localhost:5000/api/users/verify-bank-account",
                { ...formInput, userId }
            );
            console.log(response.data);
            if (response.data.success) {
                setIsVerified(true);
                toast.success("Bank account verified successfully");
                setTimeout(() => {
                    router.push("/pincode");
                }, 1200);
            } else {
                toast.error(
                    response.data.message || "Failed to verify bank account"
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(
                    error.response.data.message ||
                        "An error occurred while verifying bank account"
                );
            } else {
                toast.error("An unexpected error occurred");
            }
            console.error("Error verifying bank account:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateAccNo = (accNo: string): boolean => {
        return /^\d+$/.test(accNo);
    };

    const validateIfscCode = (ifsc: string): boolean => {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
    };

    return (
        <div className={styles.wrapper}>
            <Toaster toastOptions={{ duration: 1200 }} />
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Bank Account Verification</h1>
                <label className={styles.label}>Enter your IFSC code</label>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Enter your IFSC code"
                        name="ifsc"
                        required
                        value={formInput.ifsc}
                        onChange={handleChange}
                    />
                </div>
                {error.ifsc && (
                    <div className={styles.errorMessage}>{error.ifsc}</div>
                )}
                <label className={styles.label}>
                    Enter your account number
                </label>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Enter your account number"
                        name="accNo"
                        required
                        value={formInput.accNo}
                        onChange={handleChange}
                    />
                </div>
                {error.accNo && (
                    <div className={styles.errorMessage}>{error.accNo}</div>
                )}
                <div className={styles.buttonContainer}>
                    <button
                        onClick={verifyAcc}
                        className={styles.button}
                        disabled={loading || isVerified}
                    >
                        {loading ? (<>
                           verifying <ClipLoader
                                color={"#ffffff"}
                                loading={loading}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                
                            />
                            </>
                        ) : isVerified ? (
                            <span>Verified</span>
                        ) : (
                            <span>Verify </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankAccountVerification;
