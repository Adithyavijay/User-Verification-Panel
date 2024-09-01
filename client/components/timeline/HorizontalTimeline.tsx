import styles from './HorizontalTimeline.module.css';
import { FaCheck } from 'react-icons/fa';

interface Step{
    id: string,
    label:string
}
interface HorizontalTimelineProps{
        currentStep:string
}

const steps : Step[]= [
    { id: 'register', label: 'Register' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'email', label: 'Email' },
    { id: 'aadhar', label: 'Aadhar' },
    { id: 'pan', label: 'PAN' },
    { id: 'gst', label: 'GST' },
    { id: 'bank', label: 'Bank' },
    { id: 'pincode', label: 'Pincode' },
  ];

  const HorizontalTimeline: React.FC<HorizontalTimelineProps> =({currentStep })=>{
    const currentIndex   = steps.findIndex(s=>s.id===currentStep) 
   
    return ( 
       <div className={styles.timeline}>
        {steps.map((step,index)=>(
            <div key={step.id} className={styles.step}>
                <div className={`${styles.circle} 
                ${index <currentIndex ? styles.completed : index===currentIndex ? styles.active : ""}
                `} >
                { currentIndex > index ? <FaCheck className={styles.checmark}/> : <span>{index+1}</span> }
                {index < steps.length-1 && <div className={`${styles.connector} ${index<currentIndex ? styles.completed: ""}`}></div>}

                </div>
               <span className="label">
                {step.label}
               </span>
             
            </div>
        ))}
       </div>
    )
  } 

  export default HorizontalTimeline;