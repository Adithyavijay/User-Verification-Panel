'use client'
import PincodeVerification from '@/components/pincode/Pincode'
import React from 'react';
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';
import { useState } from 'react';

const Pincode:React.FC = () => {
  const [allStepsCompleted,setAllStepsCompleted]=useState<boolean>(false)

  const handlePincodeVerification =( )=>{
    setAllStepsCompleted(true)
  }
  return (
    <div>
      <HorizontalTimeline currentStep="pincode" allStepsCompleted={allStepsCompleted}/>
      <PincodeVerification onVerificationSuccess={handlePincodeVerification}/>
    </div>
  )
}

export default Pincode