'use client'
import EmailRegistration from '@/components/EmailRegistration/EmailRegistration'
import React from 'react';
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';

const EmailRegistrationPage : React.FC = () => {
  return ( 
    <>
    <HorizontalTimeline currentStep="email" allStepsCompleted={false}/>
    <EmailRegistration/>
    </>
    
  )
}

export default EmailRegistrationPage