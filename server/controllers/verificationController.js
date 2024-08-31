const axios = require('axios');
const User = require('../models/User'); 
const moment = require('moment')// Adjust the path as needed

exports.verifyPan = async (req, res) => {
  const { pan, userId } = req.body;

  if (!pan || !userId) {
    return res.status(400).json({ success: false, message: 'PAN and userId are required' });
  }

  try {
    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } 
    const formattedDOB = moment(user.dob).format('DD/MM/YYYY'); 
    const capitalizedName = user.name.toUpperCase();

    // Prepare the request body for Sandbox API
    const sandboxRequestBody = {
      ["@entity"]: "in.co.sandbox.kyc.pan_verification.request",
      pan: pan,
      date_of_birth: formattedDOB, // Assuming user.dob is in the correct format
      name_as_per_pan: capitalizedName, // Using the user's name from the database
      consent: "y",
      reason: "Verification for user registration and KYC compliance"
    };

    // Make a request to Sandbox API
    const sandboxResponse = await axios.post('https://api.sandbox.co.in/kyc/pan/verify', sandboxRequestBody, {
      headers: {
        'Authorization': req.sandboxAccessToken,
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '1',
        'Content-Type': 'application/json'
      }
    });

    // Process the response from Sandbox API
    if (sandboxResponse.data.code === 200 && sandboxResponse.data.data.status === 'valid') {
      // Update user model with verified PAN
      user.pan = pan;
      user.isPanVerified = true;
      await user.save();
      
      res.json({ 
        success: true, 
        message: 'PAN verified successfully', 
        data: {
          pan: sandboxResponse.data.data.pan,
          nameMatch: sandboxResponse.data.data.name_as_per_pan_match,
          dobMatch: sandboxResponse.data.data.date_of_birth_match,
          category: sandboxResponse.data.data.category,
          aadhaarSeedingStatus: sandboxResponse.data.data.aadhaar_seeding_status
        }
      });
    } else {
      res.json({ 
        success: false, 
        message: 'PAN verification failed', 
        data: sandboxResponse.data.data 
      });
    }
  } catch (error) {
    console.error('Error verifying PAN:', error.response ? error.response.data : error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        success: false, 
        message: 'PAN verification failed', 
        error: error.response.data 
      });
    } else if (error.request) {
      res.status(500).json({ success: false, message: 'No response from verification service' });
    } else {
      res.status(500).json({ success: false, message: 'An error occurred during verification' });
    }
  }
}; 

//  route for  verifying bank account number 
exports.verifyBankAccount = async (req, res) => {
  const { accNo, ifsc, userId } = req.body;

  if (!accNo || !ifsc || !userId) {
    return res.status(400).json({ success: false, message: 'Account number, IFSC, and userId are required' });
  }

  try {
    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prepare the query parameters
    const queryParams = new URLSearchParams({
      name: user.name,
      mobile: user.phone// Assuming the phone number is stored in the 'phone' field
    }).toString();

    // Prepare the API URL
    const apiUrl = `https://api.sandbox.co.in/bank/${ifsc}/accounts/${accNo}/penniless-verify?${queryParams}`;

    // Make a request to Sandbox API
    const sandboxResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': req.sandboxAccessToken,
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '2',
        'Content-Type': 'application/json'
      }
    });
    console.log(sandboxResponse)
    // Process the response from Sandbox API
    if (sandboxResponse.data.code === 200 && sandboxResponse.data.data.account_exists) {
      
      user.bankAccount = accNo;
      user.ifsc = ifsc;
      user.isBankAccountVerified = true;
      await user.save();
      
      res.json({ 
        success: true, 
        message: 'Bank account verified successfully', 
        data: sandboxResponse.data 
      });
    } else if(sandboxResponse.data.code === 200 && !sandboxResponse.data.data.account_exists){
      res.json({ 
        success: false, 
        message: 'Invalid account number or ifsc provided', 
        data: sandboxResponse.data 
      });
    }

  } catch (error) {
    console.error('Error verifying bank account:', error.response ? error.response.data : error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        success: false, 
        message: 'Bank account verification failed', 
        error: error.response.data 
      });
    } else if (error.request) {
      res.status(500).json({ success: false, message: 'No response from verification service' });
    } else {
      res.status(500).json({ success: false, message: 'An error occurred during verification' });
    }
  }
};
 

// otp verification for aadhar 
 
// send otp to the registered mobile number of user 
exports.sendAadhaarOTP = async (req, res) => {
  const {aadharNumber  } = req.body;
  console.log(aadharNumber )
  try {
  
  

    const response = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp', {
      ["@entity"]: "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
      aadhaar_number: aadharNumber ,
      consent: "y",
      reason: "Verification for user registration and KYC compliance" // Ensure this is at least 20 characters
    }, {
      headers: {
        'Authorization': req.sandboxAccessToken,
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '1.0',
        'Content-Type': 'application/json'
      }
    }); 
     console.log(response.data.code===200 && response.data.data.ref_id)
    if(response.data.code===200 && response.data.data.ref_id) {
      res.json({ 
        success: true, 
        ref_id: response.data.data.ref_id,
        message: 'OTP sent successfully'
      });
    }
    if(response.data.code===200 &&  !response.data.data.ref_id) {
      res.json({ 
        success: false, 
        message: 'invalid aadhar card'
      });
    } 

    
   
  } catch (error) {
    console.error('Error sending Aadhaar OTP:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  } 
};

exports.verifyAadhaarOTP = async (req, res) => {
  const { otp, referenceId,userId } = req.body; 
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const response = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify', { 
      ["@entity"]: "in.co.sandbox.kyc.aadhaar.okyc.request",
      reference_id : referenceId,
      otp: otp
    }, {
      headers: {
        'Authorization': req.sandboxAccessToken,
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '2.0',
        'Content-Type': 'application/json'
      }
    });
    console.log(response)
    if(response.data.code ===200 && response.data.data.status==='VALID'){ 
      user.isAadharVerified=true;
      await user.save();
      res.json({ success: true, data: response.data.data }); 
    } 
    else {
      res.json({success:false , data:response.data.data})
    }
    
  } catch (error) {
    console.error('Error verifying Aadhaar OTP:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error?.response?.data?.data });
  }
};
 

// verify gstin 

exports.verifyGstin = async (req, res) => {
  const { gstin, userId } = req.body;
 
  if (!gstin || !userId) {
    return res.status(400).json({ success: false, message: 'GSTIN and userId are required' });
  }

  try {
    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Make a request to GSTIN verification API (replace with actual API endpoint)
    const verificationResponse = await axios.post('https://api.sandbox.co.in/gst/compliance/public/gstin/search', {
      gstin: gstin
    }, {
      headers: {  
        'authorization': req.sandboxAccessToken,
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-version': '1.0',
        'Content-Type': 'application/json',
        'x-accept-cache':'true',
      }
    });

    if (verificationResponse.data.code === 200 && verificationResponse.data.data.data.sts === "Active") {
      // Update user model with verified GSTIN
      user.gstin = gstin;
      user.isGstVerified = true;
      await user.save();
      console.log(verificationResponse.data.data.data.sts)
      
        res.json({ 
          success: true, 
          message: 'GSTIN verified successfully', 
          data: verificationResponse.data
        });
    
    } else {
      res.json({ 
        success: false, 
        message: 'GSTIN verification failed', 
        data: verificationResponse.data
      });
    }

  } catch (error) {
    console.error('Error verifying GSTIN:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'GST verificatin failed' });
  }
};

