import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import './Form.css';
import Beep from './beep.mp3';

const Form = () => {

  
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isConfirmingSubmission, setIsConfirmingSubmission] = useState(false);
  const [isConfirmingFieldInput,setIsConfirmingFieldInput] = useState(false);
  const [isRepeating,setIsRepeating] = useState(false);
  const [micTimeout, setMicTimeout] = useState(5000);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateofbirth: '',
    email: '',
    gender: '',
    maritalstatus: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  const dateInputRef = useRef(null);

  const refs = {
    firstnameRef: useRef(null),
    lastnameRef: useRef(null),
    dateofbirthRef: useRef(null),
    emailRef: useRef(null),
    genderRef: useRef(null), 
    maritalstatusRef: useRef(null),
    phoneRef: useRef(null),
    cityRef: useRef(null),
    stateRef: useRef(null),
    countryRef: useRef(null),
    pincodeRef: useRef(null),
  };

  const fieldNameMap = {
    'firstname': 'first name',
    'lastname': 'last name',
    'dateofbirth': 'date of birth',
    'email': 'email',
    'gender': 'gender',
    'maritalstatus': 'marital status',
    'phone': 'phone',
    'city': 'city',
    'state': 'state',
    'country': 'country',
    'pincode': 'pin code',
  };

  const fields = [
    'firstname',
    'lastname',
    'dateofbirth',
    'email',
    'gender',
    'maritalstatus',
    'phone',
    'city',
    'state',
    'country',
    'pincode',
  ];

  const dropdowns = {
    city: [
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'ahmedabad', 'chennai', 
      'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 
      'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 
      'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 
      'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vijayawada', 
      'aurangabad', 'madurai', 'mysore', 'jammu', 'amritsar', 
      'jabalpur', 'kota', 'dehradun', 'rourkela', 'cuttack', 'trichy', 
      'salem', 'durgapur', 'siliguri', 'ranchi'
    ],
    state: [
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 
      'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 
      'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 
      'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 
      'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 
      'west bengal'
    ],
    country: [
      'india', 'usa', 'uk', 'canada', 'australia', 'germany', 'france', 
      'italy', 'spain', 'china', 'japan', 'south korea', 'brazil', 
      'mexico', 'south africa', 'nigeria', 'argentina', 'colombia', 
      'chile', 'peru', 'sweden', 'norway', 'denmark', 'netherlands', 
      'belgium', 'switzerland', 'austria', 'new zealand', 'singapore', 
      'malaysia', 'thailand', 'philippines', 'indonesia', 'pakistan', 
      'bangladesh', 'nepal', 'sri lanka', 'uae', 'saudi arabia', 'qatar', 
      'kuwait', 'oman', 'bahrain'
    ],
    gender: ['mail','female','other'],
    maritalstatus: ['single','married','divorced']
  };
  

  useEffect(() => {
    if (isVoiceEnabled) {
      console.log('Voice input started.');
 
      const beep = new Audio(Beep);
      beep.play();
    
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          console.log('Recognized speech:', transcript);
          if (isConfirmingSubmission) {
            handleSubmissionConfirmation(transcript);
          } else if (isConfirmingFieldInput) {
            handleFieldConfirmation(transcript);
          }else if (['city', 'state', 'country','gender','maritalstatus'].includes(fields[currentFieldIndex])) {
            handleDropdownInput(transcript);
          } else {
            handleFieldInput(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
          setFeedback('Error recognizing speech.');
          recognition.stop();
          setIsVoiceEnabled(false);
        };

        recognition.start();
        console.log('Recognition started.');

        const timeoutId = setTimeout(() => {
          if (isVoiceEnabled) {
            console.log('Voice input timed out.');
            recognition.stop();
            handleEmptyInput();
          }
        }, micTimeout);

        return () => {
          recognition.stop();
          beep.play();
          console.log('Recognition stopped.');
          clearTimeout(timeoutId);
        };
    }
  }, [isVoiceEnabled, currentFieldIndex, micTimeout,isConfirmingSubmission,isConfirmingFieldInput]);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
       dateInputRef.current.focus(); // Trigger the date picker
    }
  };

  const speak = (text) => {
    return new Promise((resolve) => {
      console.log('Speaking:', text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        console.log('Speech ended.');
        resolve();
      };
      utterance.onerror = () =>{
        console.log('Speech error.');
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  const handleFieldInput = async (input) => {
    const field = fields[currentFieldIndex];
    let updatedInput = input;
    if (field === 'dateofbirth') {
      const parsedDate = parseDateInput(input);
      if (parsedDate) {
        updatedInput = parsedDate;
        if (dateInputRef.current) {
          dateInputRef.current.value = updatedInput; // Update the date input field
          dateInputRef.current.focus(); // Optionally focus to open the calendar picker
      }
      } else {
        setFeedback('Please provide a valid date of birth.');
        return;
      }
    }
    else if (field === 'email') {
      updatedInput = input.replace(/\s+/g, '');
    }
    console.log(`Captured ${field}:`, updatedInput);
    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedInput,
    }));
    setFeedback(`Captured ${field}: ${updatedInput}`);
    await promptFieldConfirmation();
  };

  const parseDateInput = (dateString) => {
    const dateFormats = [
        /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/, // e.g., 23/06/2001 or 23-06-2001
        /^\d{1,2} \w+ \d{4}$/,           // e.g., 23 June 2001
    ];
    // Parse date in various formats
    for (const format of dateFormats) {
        if (format.test(dateString)) {
            let date;
            if (dateString.includes('-') || dateString.includes('/')) {
                // Assume format: dd-mm-yyyy or dd/mm/yyyy
                const [day, month, year] = dateString.split(/[-/]/);
                date = new Date(`${year}-${month}-${day}`);
            } else {
                // Assume format: dd month yyyy
                date = new Date(dateString);
            }
            if (!isNaN(date)) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        }
    }
    return null; // Invalid date format
  };

  const handleDropdownInput = async (input) => {
    const field = fields[currentFieldIndex];
    const options = dropdowns[field];
    if (options.includes(input)) {
      console.log(`Selected ${field}:`, input);
      setFormData((prevData) => ({
        ...prevData,
        [field]: input,
      }));
      setFeedback(`Selected ${field}: ${input}`);
      // await moveToNextField();
      await promptFieldConfirmation();
    } else {
      console.log(`Invalid ${field} input:`, input);
      setFeedback(`Please select a valid ${field} from the dropdown.`);
    }
  };

  const handleEmptyInput = async () => {
    // setIsRepeating(true);
    if(currentFieldIndex!==-1){
      console.log('No input received for:', fields[currentFieldIndex]);
      setFeedback(`No input received. Please say your ${fields[currentFieldIndex]} again.`);
    }else{
      console.log('please say "Submit" to submit the form or "change field" ');
      setFeedback(`please say "Submit" to submit the form or "change field"`);
    }
    setIsVoiceEnabled(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if(isConfirmingFieldInput){
      await promptFieldConfirmation();
    }else if(currentFieldIndex!==-1){
      await promptUserForField(fields[currentFieldIndex]);
    }else{
      await handleSubmissionProcess();
    }
  };

  const handleSubmissionProcess = async () => {
    console.log('Initiating submission process.');
    setIsVoiceEnabled(false);
    const fullName = `${formData.firstname}  ${formData.lastname}`;
    const dateOfBirth = formData.dateofbirth;
    if(isRepeating === false){
      await speak(`You have entered full name as ${fullName} and date of birth as ${dateOfBirth} etc`);
      await speak('Would you like to change first name, last name, etc or submit the form?');
    }else{
      await speak('sorry i didnt get your voice, Would you like to change any field, or submit the form?');
      setIsRepeating(false);
    }
    
    setIsConfirmingSubmission(true);
    setIsVoiceEnabled(true);
  };

  const handleSubmissionConfirmation = async (lowerTranscript) => {
    console.log('Confirming submission with:', lowerTranscript);
    const fieldToChange = Object.keys(fieldNameMap).find((field) => lowerTranscript.includes(`change ${fieldNameMap[field]}`));
    const fieldIndex = fields.indexOf(fieldToChange);
    if (lowerTranscript === 'submit') {
      setFeedback('Form submitted successfully.');
      console.log('Form Data Submitted:', formData);
      resetForm();
    }else if (fieldIndex !== -1) {
      setIsConfirmingSubmission(false);
      setCurrentFieldIndex(fieldIndex);
      await promptUserForField(fieldToChange);
    }
    else {
      setFeedback('Please say "submit" or "change field".');
      setCurrentFieldIndex(-1);
      await handleSubmissionProcess();
    }
  };

  const moveToNextField = async () => {
    console.log('Moving to the next field.');
    const nextFieldIndex = fields.findIndex((field) => {
      return (Array.isArray(formData[field])&&formData[field].length === 0 || formData[field] === '')&& field !== fields[currentFieldIndex];
    });
    setCurrentFieldIndex(nextFieldIndex);
    if (nextFieldIndex !== -1) {
      console.log('Next field:', fields[nextFieldIndex]);
      await promptUserForField(fields[nextFieldIndex]);
    } else {
      console.log('All fields filled. Prompting for submission.');
      await handleSubmissionProcess();
    }
  };

  const promptUserForField = async (field) => {
    console.log('Prompting for:', field);
    setIsVoiceEnabled(false);
    if(isRepeating === false){
      await speak(`Please say your ${field}`);
    }else{
      await speak(`sorry i didnt get your voice or the input is invalid can you please repeat ${field}`);
      setIsRepeating(false);
    }
    setIsVoiceEnabled(true);
    scrollToField(field);
  };

  const promptFieldConfirmation = async () => {
    console.log(`Prompting for confirmation of:${fields[currentFieldIndex]}`);
    setIsVoiceEnabled(false);
    if(isRepeating === false){
      await speak(`Do you want to confirm or edit?`);
    }else{
      await speak(`sorry i didnt get your voice please say confirm or edit to confirm or edit the field`);
      setIsRepeating(false);
    }
    setIsConfirmingFieldInput(true);
    setIsVoiceEnabled(true);
  };

  const handleFieldConfirmation = async (transcript) => {
      if (transcript === 'confirm') {
        console.log('Field confirmed:', fields[currentFieldIndex]);
        setIsConfirmingFieldInput(false);
        await moveToNextField();
      } else if (transcript === 'edit') {
        console.log('Re-prompting for field:', fields[currentFieldIndex]);
        setIsConfirmingFieldInput(false);
        await promptUserForField(fields[currentFieldIndex]);
      } else {
        console.log('Invalid response. Asking again for confirmation.');
        setFeedback('Please say "confirm" or "edit".');
        await promptFieldConfirmation();
      }
  };

  const scrollToField = (field) => {
    console.log('Scrolling to field:', field);
    const ref = refs[`${field}Ref`];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: type === 'radio' ? (checked ? value : prevData[name]) : value,
  }));
  };

  const handleStartVoiceInput = async () => {
    console.log('Starting voice input.');
    const nextFieldIndex = fields.findIndex((field) => formData[field] === ''||Array.isArray(formData[field])&&formData[field].length === 0);
    console.log('Next empty field index:', nextFieldIndex);
    setCurrentFieldIndex(nextFieldIndex);
    if (nextFieldIndex !== -1) {
      console.log('Next field to fill:', fields[nextFieldIndex]);
      await promptUserForField(fields[nextFieldIndex]);
      console.log('Prompted for field:', fields[nextFieldIndex]);
      setIsVoiceEnabled(true);
      console.log('Voice input enabled.');
    } else {
      console.log('All fields are filled. Prompting for submission.');
      await handleSubmissionProcess();
    }
  };

  const handleSubmit = () => {
    setFeedback('Form submitted manually.');
    console.log('Form Data Submitted:', formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstname: '',
      lastname: '',
      dateofbirth: '',
      email: '',
      gender: '',
      maritalstatus: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    });
    setCurrentFieldIndex(0);
    setIsVoiceEnabled(false);
    setIsConfirmingSubmission(false);
    setFeedback('');
  };

  return (
  <div className="form-carousel-wrapper" style={{ display: "flex"}}>
    <div className="form-container">
      <button onClick={handleStartVoiceInput} className="voice-button">
        Start Voice Input
      </button>
      <button onClick={handleSubmit} className="submit-button">
        Submit Form Manually
      </button>
      <div className="feedback">{feedback}</div>
      <form>
        {fields.map((field) => (
          <div key={field} className="form-field" ref={refs[`${field}Ref`]}>
            <label className="form-label">
              {fieldNameMap[field]}:
              {['city', 'state', 'country'].includes(field) ? (
                <select
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">
                    Select {field.charAt(0).toUpperCase() + field.slice(1)}
                  </option>
                  {dropdowns[field].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field === 'gender' ? (
                  <div className="form-radio-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="mail"
                        checked={formData.gender === 'mail'}
                        onChange={handleInputChange}
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                      />
                      Female
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleInputChange}
                      />
                      Other
                    </label>
                </div>
              ) : field==='maritalstatus' ? (
                <div className="form-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="maritalstatus"
                      value="single"
                      checked={formData.maritalstatus === 'single'}
                      onChange={handleInputChange}
                    />
                    Single
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="maritalstatus"
                      value="married"
                      checked={formData.maritalstatus === 'married'}
                      onChange={handleInputChange}
                    />
                    Married
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="maritalstatus"
                      value="divorced"
                      checked={formData.maritalstatus === 'divorced'}
                      onChange={handleInputChange}
                    />
                    Divorced
                  </label>
              </div>
              ) : field === 'dateofbirth' ? (
                <div className="date-picker-container">
                  <input
                    type="date"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="form-input"
                    ref={dateInputRef} // Assign ref to the input
                    placeholder="Enter date of birth"
                  />
                  <FaCalendarAlt
                    className="calendar-icon"
                    onClick={handleCalendarClick}
                  />
                </div>
              ): (
                <input
                  type={'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="form-input"
                  ref={refs[`${field}Ref`]}
                  // placeholder={field==='firstname'? "enter first name":field==="lastname"?"enter last name":field==="dateofbirth"?"eg:23-june-2001":field==="email"?"enter email(eg@gmail.com)":field==="phone"?"enter 10 digit phone number":"enter pincode"}
                />
              )}
            </label>
          </div>
        ))}
      </form>
    </div>
    <div className="carousel-container" id="carousel">
        {/* Placeholder for carousel */}
    </div>
  </div>
  );
};

export default Form;
