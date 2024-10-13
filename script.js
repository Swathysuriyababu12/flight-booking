document.addEventListener("DOMContentLoaded", function () {
  const countryInput = document.getElementById("country");
  const departureInput = document.getElementById("departure");
  const destinationInput = document.getElementById("destination");
  let cities = []; // Store cities for the selected country

  // Fetch countries based on user input
  countryInput.addEventListener("input", function () {
    const query = this.value;
    if (query.length >= 2) {
      fetchCountries(query);
    } else {
      clearSuggestions("countrySuggestions");
      clearSuggestions("departureSuggestions");
      clearSuggestions("destinationSuggestions");

      cities = []; // Clear city suggestions when country input is cleared
    }
  });

  // Fetch cities based on user input for departure and destination
   departureInput.addEventListener("input", function () {
     console.log(this.value);
     showSuggestions(cities,this.value,"departureSuggestions")
   });

   destinationInput.addEventListener("input", function () {
     showSuggestions(cities, this.value, "destinationSuggestions");
   });

  document
    .getElementById("flightForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const departure = departureInput.value.trim();
      const destination = destinationInput.value.trim();
      const departureDate = document.getElementById("departureDate").value;
      const returnDate = document.getElementById("returnDate").value;

      // Simple validation for return date
      if (new Date(returnDate) < new Date(departureDate)) {
        alert("Return date cannot be earlier than departure date.");
        return;
      }

      // Dummy flight data for demonstration
      const flightData = [
        {
          flight: "Flight 101",
          departure,
          destination,
          date: departureDate,
          price: "$400",
        },
        {
          flight: "Flight 102",
          departure,
          destination,
          date: departureDate,
          price: "$450",
        },
        {
          flight: "Flight 103",
          departure,
          destination,
          date: returnDate,
          price: "$380",
        },
        {
          flight: "Flight 104",
          departure,
          destination,
          date: returnDate,
          price: "$420",
        },
      ];

      displayFlightResults(flightData);
    });

  // Function to fetch countries
  async function fetchCountries(query) {
    const url = `https://restcountries.com/v3.1/name/${query}`;
    try {
      const response = await fetch(url);
      const countries = await response.json();
      showSuggestions(countries, countryInput, "countrySuggestions");
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  // Function to fetch cities based on country
  async function fetchCities(countryCode, inp, sug) {
    console.log(countryCode);
    if (!countryCode) return; // Don't fetch if country is not set

    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "edae0539c2msh92d7be8fcad69d3p1f9772jsnc2b9dedea8dc",
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      cities = data.data; // Store fetched cities for filtering
      console.log(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  // Filter cities based on user input
  function filterCities(query, suggestionsBoxId) {
    const suggestionsBox = document.getElementById(suggestionsBoxId);
    suggestionsBox.innerHTML = "";
    if (query.length < 2) {
      return; // Don't show suggestions if input is less than 2 characters
    }

    // Filter cities based on query
    const filteredCities = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    showSuggestions(filteredCities, suggestionsBoxId);
  }

  // Function to show suggestions in a dropdown
  function showSuggestions(data, inputElement, suggestionsBoxId) {
    console.log(suggestionsBoxId);
    const suggestionsBox = document.getElementById(suggestionsBoxId);
    console.log(suggestionsBox);
    suggestionsBox.innerHTML = "";
    data.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      // Adjust according to the API response
      if (suggestionsBoxId === "countrySuggestions") {
        div.textContent = item.name.common;
      } else if (suggestionsBoxId === "departureSuggestions") {
        div.textContent = item.name;
      } else {
        div.textContent = item.name;
      }
      div.onclick = () => {
        if (suggestionsBoxId === "countrySuggestions") {
          inputElement.value = item.name.common; // Populate country input
          fetchCities(item.cca2); // Fetch cities for the selected country using its code
        } else if (suggestionsBoxId === "departureSuggestions") {
          inputElement.value = item.name; // Populate departure input
        } else if (suggestionsBoxId === "destinationSuggestions") {
          inputElement.value = item.name; // Populate destination input
        }
        clearSuggestions(suggestionsBoxId); // Clear suggestions
      };
      suggestionsBox.appendChild(div);
    });
  }

  // Clear suggestions when input is empty
  function clearSuggestions(suggestionsBoxId) {
    const suggestionsBox = document.getElementById(suggestionsBoxId);
    suggestionsBox.innerHTML = "";
  }

  // Function to display flight results in a modal
  function displayFlightResults(flightData) {
    const flightTableBody = document.getElementById("flightTableBody");
    flightTableBody.innerHTML = ""; // Clear previous results

    flightData.forEach((flight) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${flight.flight}</td>
                <td>${flight.departure}</td>
                <td>${flight.destination}</td>
                <td>${flight.date}</td>
                <td>${flight.price}</td>
            `;
      flightTableBody.appendChild(row);
    });

    // Show the modal
    $("#flightModal").modal("show");
  }
});
