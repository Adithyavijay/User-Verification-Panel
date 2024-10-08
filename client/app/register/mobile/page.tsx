import MobileRegistration from '@/components/MobileRegistration/MobileRegistration';
import React from 'react'
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';


const MobileRegistrationPage:React.FC = () => {
  return (
    <div>
      <HorizontalTimeline currentStep="mobile" allStepsCompleted={false}/>
      <MobileRegistration/>
      </div>
  )
}

export default MobileRegistrationPage ;