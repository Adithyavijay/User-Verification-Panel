import PincodeVerification from '@/components/pincode/Pincode'
import React from 'react';
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';

const pincode = () => {
  return (
    <div>
      <HorizontalTimeline currentStep="pincode"/>
      <PincodeVerification/>
    </div>
  )
}

export default pincode