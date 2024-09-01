import Image from "next/image";
import styles from "./page.module.css";
import RegistrationForm from "@/components/RegistrationForm/Registration";
import HorizontalTimeline from "@/components/timeline/HorizontalTimeline";

export default function Home() { 
  return (
 <>  
 <div className="wrapper"> 
 <HorizontalTimeline currentStep="register"/>
 <RegistrationForm />
 </div>
 </>
  );
}
