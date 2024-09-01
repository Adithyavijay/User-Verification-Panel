'use client'
import Pancard from '@/components/pancard/Pancard'
import React from 'react';
import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';

const pancardRegistrationPage = () => {
  return (
    <div >
      <HorizontalTimeline currentStep="pan"/>
      <Pancard/>
    </div>
  )
}

export default pancardRegistrationPage