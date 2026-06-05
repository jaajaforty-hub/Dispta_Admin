async function getData() {
    const response = await fetch("/api/data");
    const data = await response.json(); 
    
    const rightPanel = document.getElementById("right-panel");

    // Build right panel list
    data.forEach(item => {

        const ownerSummary = `
            <div class="name">${item.full_name}</div>
            <div class="email">${item.email}</div>
            <div class="phone">${item.phone}</div>  
        `;
 
        const myDiv = document.createElement('div');     
        myDiv.className = "righPanelChild";
        myDiv.innerHTML = ownerSummary;

        rightPanel.appendChild(myDiv);
    });

    const leftPanel = document.getElementById("left-panel");
    const getDrivers = document.querySelectorAll("#right-panel > div");

    // Add click events
    getDrivers.forEach(driver => {
        driver.addEventListener("click", () => {
    const driverName = driver.firstElementChild
        ? driver.firstElementChild.innerHTML.trim()
        : "";

    console.log("Clicked:", driverName);
    console.log("Data:", data);

    const matchingData = data.find(
        d => d.full_name === driverName
    );

    console.log("Match:", matchingData);

    if (matchingData) {
       leftPanel.innerHTML = `
                    <div class="name">👤..... ${matchingData.full_name}.....</div>
                    <div class="email">Email 📫 ${matchingData.email}</div>
                    <div class="phone">📞 ${matchingData.phone}</div>
                    <div class="trailerType">🚛 ${matchingData.trailer_type}</div>
                    <div class="max-weight">⚖️ ${matchingData.max_weight}</div>
                    <div class="length">📏 ${matchingData.trailer_length}</div>
                    <div class="current-state">📍 ${matchingData.current_state}</div>
                    <div class="current-city">⚓ ${matchingData.current_city}</div>
                    <div class="destination_state">🛑 ${matchingData.destination_state}</div>
                    <div class="destination_city">🚃 ${matchingData.destination_city}</div>
                    <div class="goals">🎯 ${matchingData.weekly_target}</div>
                    <div class="available_date">📅 ${matchingData.available_date}</div>
                    <div class="timeWindow">⌚ ${matchingData.time_window}</div>
                `;
    }
});



    });
}

getData();
