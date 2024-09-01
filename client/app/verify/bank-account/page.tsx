'use client'
import BankAccountVerification from '@/components/BankAccount/BankAccountVerification';
import React from 'react';
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';


const page = () => {
  return (

    <div>
      <HorizontalTimeline currentStep="bank"/>
      <BankAccountVerification/>
    </div>
  )
}

export default page