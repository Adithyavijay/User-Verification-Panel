  'use client';
  import React from 'react';
  import GstinVerification from '@/components/GST/Gst';
  import HorizontalTimeline from '@/components/timeline/HorizontalTimeline';
  
  const GSTverificationPage = () => {
    return (
      <div>
        <HorizontalTimeline currentStep="gst"/>
        <GstinVerification/>
      </div>
    )
  }
  
  export default GSTverificationPage ;