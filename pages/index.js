import Graph from "../components/Graph";
import { useState } from "react";
import { generateData, reactionStages } from "@/utils/dataGenerator";
import styles from "@/styles/home.module.css";
import TopBar from "@/components/TopBar";

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

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeading}>Process Stages</h2>
        {stages.map((stage) => (
          <div onClick={() => toggleStage(stage.name)} key={stage.name} className={styles.sidebarItem}>
            <div
              
              
              className={{
                ...styles.sidebarHeader,
                color: stage.isActive ? "#00bcd4" : "white", // Highlight expanded item
              }}
            >
              {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
            </div>
            {stage.isActive && (
              <div className={styles.sidebarContent}>
                More Controls for {stage.name}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <TopBar />
        <Graph data={dummyData} options={options} stages={stages} onStageUpdate={setStages}/>
      </div>
    </div>
  );
}