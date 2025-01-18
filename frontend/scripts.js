function showLocations() {
    const citySelect = document.getElementById("city-select");
    const locationList = document.getElementById("location-list");
    const locationSelect = document.getElementById("location-select");
    
    locationList.style.display = 'none';
    locationSelect.innerHTML = '<option value="" disabled selected>Select a location...</option>'; // Reset the locations
    
    const selectedCity = citySelect.value;

    if (selectedCity) {
      let locations = [];

      // Define locations for each city
      switch (selectedCity) {
        case "vadodara":
          locations = [
            { value: "vadodara-metro-hospital", text: "Metro Hospital" },
            { value: "sardar-vallabhbhai-patel-institute", text: "Sardar Vallabhbhai Patel Institute" },
            { value: "mandvi-gate", text: "Mandvi Gate" },
            { value: "ajwa-waterpark", text:"Ajwa Waterpark"},
            { value: "kirti-mandir", text: "Kirti Mandir" }
          ];
          break;
      }

      // Populate the location dropdown with the corresponding locations
      locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location.value;
        option.textContent = location.text;
        locationSelect.appendChild(option);
      });

      locationList.style.display = 'block'; // Show location selector
    }
  }

  function exploreLocation() {
    const locationSelect = document.getElementById("location-select");
    const selectedLocation = locationSelect.value;

    if (selectedLocation) {
      // Redirect to the page for the selected location
      window.location.href = `/${selectedLocation}-details.html`;
    } else {
      alert("Please select a haunted location to explore.");
    }
  }