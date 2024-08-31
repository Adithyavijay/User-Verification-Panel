import Image from "next/image";
import styles from "./page.module.css";
import RegistrationForm from "@/components/RegistrationForm/Registration";

export default function Home() { 
  return (
 <>  
 <div className="wrapper">
 <RegistrationForm />
 </div>
 </>
  );
}
