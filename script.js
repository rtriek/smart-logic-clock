// 1. DATA STORAGE: Array to hold all activity objects (Our local Database)
let activityLog = []; 

/**
 * 2. CLOCK ENGINE: Updates the UI every 1 second
 * Displays time in 24-hour format using International English numbers
 */
function updateClock() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('display-time').innerText = now.toLocaleTimeString('en-US', timeOptions);
}
setInterval(updateClock, 1000);

/**
 * 3. LOGGING SYSTEM: Captures user interaction as a data point
 * Each click creates a 'Row' in our virtual table
 */
function logActivity(type) {
    const timestamp = new Date().toLocaleString('en-US'); 
    
    // Create a data object for the entry
    const newEntry = { 
        activity: type, 
        timestamp: timestamp 
    };
    
    // Add entry to the main log array
    activityLog.push(newEntry);
    
    // UI FEEDBACK: Update the list on the web page
    const list = document.getElementById('activities');
    const listItem = document.createElement('li');
    listItem.textContent = `[${type}] logged at ${timestamp}`;
    list.appendChild(listItem);
    
    // UPDATE STATUS: Change visual cues based on logic
    const statusElement = document.getElementById('status');
    const clockContainer = document.getElementById('clock-container');

    if(type === 'Study') {
        statusElement.innerText = "Current Mode: Studying 🎯";
        clockContainer.style.borderColor = "#00d2ff"; // Blue glow for focus
    } else {
        statusElement.innerText = "Current Mode: Break ☕";
        clockContainer.style.borderColor = "#fdbb2d"; // Gold glow for rest
    }
}

/**
 * 4. BI EXPORT LOGIC: Converts JSON data into a CSV file
 * Compatible with Power BI, Excel, and SQL import tools
 */
function downloadCSV() {
    // Check if data exists before downloading
    if (activityLog.length === 0) {
        alert("Action Required: Please record some data (Study/Break) before exporting.");
        return;
    }

    // CSV Structure: Header Row followed by Data Rows
    let csvRows = ["Activity,Timestamp"]; // Header

    // Map the objects in our array to CSV format
    activityLog.forEach(entry => {
        csvRows.push(`${entry.activity},${entry.timestamp}`);
    });

    // Join all rows with a newline character
    const csvString = csvRows.join("\n");

    // File Generation: Create a Blob and a temporary download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", "my_productivity_log.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup after download
}

/**
 * 5. RESET LOGIC: Clears the data array and updates the UI
 * This is essential for starting a new tracking session
 */
function resetData() {
    // Confirm with the user before deleting data
    if (confirm("Are you sure you want to delete all recorded data?")) {
        
        // Clear the array (Database)
        activityLog = [];
        
        // Clear the UI List
        const list = document.getElementById('activities');
        list.innerHTML = "";
        
        // Reset the status message
        document.getElementById('status').innerText = "Ready to Start Again?";
        document.getElementById('clock-container').style.borderColor = "rgba(255,255,255,0.1)";
        
        alert("All data has been cleared.");
    }
}