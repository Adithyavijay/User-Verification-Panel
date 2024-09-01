import React from 'react';
import styles from './HorizontalTimeline.module.css';
import { FaCheck } from 'react-icons/fa';

interface Step {
    id: string;
    label: string;
}

interface HorizontalTimelineProps {
    currentStep: string;
    allStepsCompleted: boolean;
}

const steps: Step[] = [
    { id: 'register', label: 'Register' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'email', label: 'Email' },
    { id: 'aadhar', label: 'Aadhar' },
    { id: 'pan', label: 'PAN' },
    { id: 'gst', label: 'GST' },
    { id: 'bank', label: 'Bank' },
    { id: 'pincode', label: 'Pincode' },
];

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ currentStep, allStepsCompleted }) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className={styles.timeline}>
            {steps.map((step, index) => (
                <div key={step.id} className={styles.step}>
                    <div 
                        className={`${styles.circle} 
                            ${index < currentIndex || (allStepsCompleted && index === steps.length - 1) 
                                ? styles.completed 
                                : index === currentIndex ? styles.active : ""}`}
                    >
                        {index < currentIndex || (allStepsCompleted && index === steps.length - 1) 
                            ? <FaCheck className={styles.checkmark}/> 
                            : <span>{index + 1}</span>
                        }
                        {index < steps.length - 1 && (
                            <div 
                                className={`${styles.connector} 
                                    ${index < currentIndex || (allStepsCompleted && index === steps.length - 1) 
                                        ? styles.completed 
                                        : ""}`}
                            ></div>
                        )}
                    </div>
                    <span className={styles.label}>
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HorizontalTimeline;