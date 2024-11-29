import Graph from "../components/Graph";
import { useState } from "react";
import { generateData, reactionStages } from "@/utils/dataGenerator";

export default function Home() {
  const [{ dummyData, options }] = useState(generateData());
  const [stages, setStages] = useState(reactionStages);

  const toggleStage = (section) => {
    setStages((prev) =>
      prev.map((item) =>
        item.name === section ? { ...item, isActive: true } : { ...item, isActive: false }
      )
    );
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      height: "100vh",
      backgroundColor: "#f4f4f4",
    },
    sidebar: {
      width: "250px",
      backgroundColor: "#105254",
      padding: "20px",
      borderRight: "2px solid #083d3f",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      color: "white",
      boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
    },
    sidebarHeading: {
      fontSize: "1.8rem",
      marginBottom: "20px",
      color: "white",
      textAlign: "center",
    },
    sidebarItem: {
      marginBottom: "15px",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.2)",
    },
    sidebarHeader: {
      fontSize: "1.2rem",
      cursor: "pointer",
      padding: "10px",
      transition: "color 0.2s ease, background-color 0.2s ease",
      borderRadius: "5px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      textAlign: "center",
    },
    sidebarHeaderHover: {
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Optional hover effect
    },
    sidebarContent: {
      padding: "10px",
      backgroundColor: "#e9ecef",
      borderRadius: "5px",
      fontSize: "1rem",
      color: "#333",
      marginTop: "10px",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      backgroundColor: "white",
      overflowY: "auto",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeading}>Process Stages</h2>
        {stages.map((stage) => (
          <div key={stage.name} style={styles.sidebarItem}>
            <div
              onClick={() => toggleStage(stage.name)}
              
              style={{
                ...styles.sidebarHeader,
                color: stage.isActive ? "#00bcd4" : "white", // Highlight expanded item
              }}
            >
              {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
            </div>
            {stage.isActive && (
              <div style={styles.sidebarContent}>
                Content for {stage.name}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div style={styles.mainContent}>
        <Graph data={dummyData} options={options} />
      </div>
    </div>
  );
}