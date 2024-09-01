import AadharVerification from '@/components/aadhar/AadharVerification';
import React from 'react'
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';

const AadharVerificationpage = () => {
  return (
    <div>
      <HorizontalTimeline currentStep="aadhar"/>
      <AadharVerification/></div>
  )
}

export default AadharVerificationpage ;