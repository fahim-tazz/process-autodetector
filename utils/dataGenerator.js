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
                borderColor: "#0097a7",
                backgroundColor: "rgba(0, 151, 167, 0.2)", // Soft fill under the curve
                borderWidth: 2,
                tension: 0.4, // Smooth curve
                pointBackgroundColor: "#ffffff", // White point background
                pointBorderColor: "#0097a7",
                pointBorderWidth: 2,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    generateLabels: (chart) => {
                        const datasetLabels = chart.data.datasets.map((dataset, i) => ({
                            text: dataset.label,
                            // fillStyle: dataset.borderColor,
                            strokeStyle:dataset.borderColor,
                            hidden: !chart.isDatasetVisible(i),
                            datasetIndex: i,
                        }));
                        
                        // Add custom labels for vertical lines
                        const customLabels = [
                            {
                                text: "Stage Start",
                                pointStyle: "circle", // Use a circle for the legend marker
                                fillStyle: "red", // Color of the blue vertical line
                                strokeStyle: "red",
                                lineWidth: 2,
                                hidden: false,
                            },
                            {
                                text: "Stage End",
                                // fillStyle: "blue", // Color of the blue vertical line
                                strokeStyle: "blue",
                                // lineWidth: 2,
                                hidden: false,
                            },
                            {
                                text: "Unselected Stage",
                                // fillStyle: "blue", // Color of the blue vertical line
                                strokeStyle: "grey",
                                // lineWidth: 2,
                                hidden: false,
                            },
                        ];
                        
                        return [...datasetLabels, ...customLabels].map((legendLabel) => {
                            return {
                                ...legendLabel,
                                fillStyle: "rgba(199, 202, 209, 0.4)",
                                lineWidth: 2,
                                borderRadius: 2,
                            }
                        });
                    }
                },
            },
            title: { display: true, text: "Temperature vs. Time (1 Hour)" },
            tooltip: {
                backgroundColor: "#ffffff", // White background
                titleColor: "#333333", // Dark text for better readability
                bodyColor: "#666666",
                borderColor: "#cccccc",
                borderWidth: 1,
                cornerRadius: 8,
            }
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
    { name: "heatup", start: -1, end: 0, isActive: true },
    { name: "reaction", start: -1, end: 0, isActive: false },
    { name: "crystallization", start: -1, end: 0, isActive: false },
    { name: "cooldown", start: -1, end: 0, isActive: false },
];