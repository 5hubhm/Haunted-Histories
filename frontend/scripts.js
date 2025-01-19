// Function to display locations based on the selected city
function showLocations() {
  const citySelect = document.getElementById("city-select");
  const locationList = document.getElementById("location-list");
  const locationSelect = document.getElementById("location-select");

  locationList.style.display = "none"; // Hide location selector by default
  locationSelect.innerHTML = '<option value="" disabled selected>Select a location...</option>'; // Reset locations

  const selectedCity = citySelect.value;

  if (selectedCity) {
    // Save the selected city in localStorage
    localStorage.setItem("selectedCity", selectedCity);

    let locations = [];

    // Define locations for Vadodara
    if (selectedCity === "vadodara") {
      locations = [
        { value: "vadodara_metro_hospital", text: "Metro Hospital" },
        { value: "sardar_vallabhbhai_patel_museum", text: "Sardar Vallabhbhai Patel Institute" },
        { value: "mandvigate", text: "Mandvi Gate" },
        { value: "ajwa_waterpark", text: "Ajwa Waterpark" },
        { value: "kirti_mandir", text: "Kirti Mandir" },
      ];
    }

    // Populate the location dropdown with the corresponding locations
    locations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.value;
      option.textContent = location.text;
      locationSelect.appendChild(option);
    });

    locationList.style.display = "block"; // Show location selector
  }
}

// Function to redirect to the selected location's details page
function exploreLocation() {
  const locationSelect = document.getElementById("location-select");
  const selectedLocation = locationSelect.value;

  if (selectedLocation) {
    const citySelect = document.getElementById("city-select");
    const selectedCity = citySelect.value;

    // Redirect to the page in the city folder
    window.location.href = `./stories/${selectedCity}/${selectedLocation}.html`;
  } else {
    alert("Please select a haunted location to explore.");
  }
}

// Function to restore the selected city and populate the locations on page load
function restoreCitySelection() {
  const citySelect = document.getElementById("city-select");
  const savedCity = localStorage.getItem("selectedCity");

  if (savedCity) {
    citySelect.value = savedCity; // Restore the saved city selection
    showLocations(); // Populate the locations for the saved city
  } else {
    citySelect.value = ""; // Reset to placeholder
  }
}

// Call restore function on page load
document.addEventListener("DOMContentLoaded", () => {
  restoreCitySelection();
});
