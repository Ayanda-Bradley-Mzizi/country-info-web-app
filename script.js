// Select elements
const input = document.getElementById('country-input');
const button = document.getElementById('submit-btn');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

// Fetch country data
async function fetchCountryData(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        return data[0];
    } catch (error) {
        displayError(error.message);
    }
}

// Fetch bordering countries
async function fetchBorderCountries(borders) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching border countries:', error);
    }
}

// Display country information
function displayCountryInfo(country) {
    countryInfoSection.innerHTML = `
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Flag:</strong></p>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
    `;
}

// Display bordering countries
function displayBorderCountries(countries) {
    borderingCountriesSection.innerHTML = '<h3>Bordering Countries:</h3>';
    countries.forEach(country => {
        borderingCountriesSection.innerHTML += `
            <p>${country.name.common}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
        `;
    });
}

// Display error message
function displayError(message) {
    countryInfoSection.innerHTML = `<p class="error">${message}</p>`;
    borderingCountriesSection.innerHTML = '';
}

// Event listener for button click
button.addEventListener('click', async () => {
    const countryName = input.value.trim();
    if (!countryName) {
        displayError('Please enter a country name.');
        return;
    }

    const countryData = await fetchCountryData(countryName);
    if (countryData) {
        displayCountryInfo(countryData);

        if (countryData.borders && countryData.borders.length > 0) {
            const borderCountries = await fetchBorderCountries(countryData.borders);
            displayBorderCountries(borderCountries);
        } else {
            borderingCountriesSection.innerHTML = '<p>No bordering countries.</p>';
        }
    }
});
