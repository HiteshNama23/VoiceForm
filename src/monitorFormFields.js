// monitorFormFields.js

document.addEventListener('DOMContentLoaded', () => {
  const waitForFormFields = () => {
    const cityElement = document.querySelector('select[name="city"]');
    const stateElement = document.querySelector('select[name="state"]');
    const countryElement = document.querySelector('select[name="country"]');

    if (cityElement && stateElement && countryElement) {
      logFormFieldValues(cityElement, stateElement, countryElement);
    } else {
      // Retry after a short delay if the elements are not found
      setTimeout(waitForFormFields, 100);
    }
  };

  const logFieldValue = (field, value) => {
    console.log(`Current ${field}: ${value}`);
  };

  const logFormFieldValues = (cityElement, stateElement, countryElement) => {
    // Log initial values
    logFieldValue('City', cityElement.value);
    logFieldValue('State', stateElement.value);
    logFieldValue('Country', countryElement.value);

    // Attach event listeners to monitor changes
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

  // Call the function to wait for form fields and start logging
  waitForFormFields();
});
