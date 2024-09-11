document.addEventListener('DOMContentLoaded', () => {
  const waitForFormFields = () => {
    const cityElement = document.querySelector('select[name="city"]');
    const stateElement = document.querySelector('select[name="state"]');
    const countryElement = document.querySelector('select[name="country"]');
    const submitButtonElement = document.getElementsByClassName('submit-button')[0];

    if (cityElement && stateElement && countryElement && submitButtonElement) {
      logFormFieldValues(cityElement, stateElement, countryElement);
      // autoClickVoiceButton(submitButtonElement);
    } else {
      setTimeout(waitForFormFields, 100);
    }
  };

  const logFieldValue = (field, value) => {
    console.log(`Current ${field}: ${value}`);
  };

  const logFormFieldValues = (cityElement, stateElement, countryElement) => {
    logFieldValue('City', cityElement.value);
    logFieldValue('State', stateElement.value);
    logFieldValue('Country', countryElement.value);

    cityElement.addEventListener('change', () => {
      logFieldValue('City', cityElement.value);
    });

    stateElement.addEventListener('change', () => {
      logFieldValue('State', stateElement.value);
    });

    countryElement.addEventListener('change', () => {
      logFieldValue('Country', countryElement.value);
    });
  };

  const autoClickVoiceButton = (buttonElement) => {
    setInterval(() => {
      console.log('Voice button clicked');
      buttonElement.click();
    }, 10000); // Adjust the interval time
  };

  waitForFormFields();
});
