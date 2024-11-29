export const generateData = () => {
    let labels = [];
    let data = [];
    const startTime = new Date(); // Get the current time as the starting point

    for (let i = 0; i < 120; i++) {
        // Increment time by 30 seconds for each label
        const time = new Date(startTime.getTime() + i * 30 * 1000);
        labels.push(time.toISOString()); // Convert to ISO string

        // Generate corresponding Y-axis values (e.g., temperature data)
        data.push(20 + Math.sin(i / 10) * 5 + Math.random() * 3);
    }
    const dummyData = {
        labels: labels,
        datasets: [
            {
            label: "Temperature (°C)",
            data: data,
            borderColor: "teal",
            tension: 0.1,
            fill: false
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Temperature vs. Time (1 Hour)" },
        },
        scales: {
            x: {
                type: "time", // Use the time scale
                time: {
                    unit: "minute", // Set the granularity to minutes
                    displayFormats: {
                        minute: "mm:ss", // Format for time labels
                    },
                    tooltipFormat: "mm:ss", // Format for tooltips
                },
                title: { display: true, text: "Time (Minutes:Seconds)" },
            },
            y: {
                title: { display: true, text: "Temperature (°C)" },
                min: 15,
                max: 35,
            },
        },
    };
    return { dummyData, options }
}

export const reactionStages = [
    { name: "heatup", start: -1, end: 0, isActive: false },
    { name: "reaction", start: -1, end: 0, isActive: false },
    { name: "crystallization", start: -1, end: 0, isActive: false },
    { name: "cooldown", start: -1, end: 0, isActive: false },
];