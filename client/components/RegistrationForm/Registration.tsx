"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import styles from "./Registration.module.css";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

interface FormData {
    name: string;
    email?: string;
    phone?: string;
    aadhar?: string;
    dob: string;
}

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        dob: "",
    });
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/users/register",
                formData
            );
            toast.success('User registered successfully');
            localStorage.setItem("userId", data.userId);
            setIsVerified(true);
            setTimeout(() => {
                router.push('/register/mobile');
            }, 1200);
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Toaster toastOptions={{ duration: 1200 }} />
            <form onSubmit={handleSubmit} className={styles.formElement}>
                <header className={styles.header}>Registration form</header>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    disabled={isVerified}
                />
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    disabled={isVerified}
                />
                <button
                    type="submit"
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
                        <span>Registered</span>
                    ) : (
                        <span>Register</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;