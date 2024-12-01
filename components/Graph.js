import React, {useState, useEffect, useRef} from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";
import styles from "@/styles/graph.module.css";


ChartJS.register(LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

const offset = 20; // Fixed offset integer

const Graph = (props) => {
  const numStages = props.stages.length;
  const stagesRef = useRef(Array.from({ length: numStages }, () => ({})));
  const chartRef = useRef(null);
  const isDraggingRef = useRef(Array.from({ length: numStages }, () => (false)));
  
  // Event Listeners
  useEffect(() => {
    const canvas = chartRef.current?.canvas;
  
    if (!canvas) return;
  
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("dblclick", handleDoubleClick);
  
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  // Bind Refs to barXPositions, chart, isDragging
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const xScale = chart.scales.x;
  
      // Calculate the interval for evenly spacing start and end positions
      const interval = (xScale.max - xScale.min) / numStages;
    
      if (props.stages[0].start == -1) {
        // Initial Mount
        stagesRef.current = props.stages.map((stage, index) => ({
          name: stage.name,
          start: xScale.min + interval * index, // Start position for this stage
          end: xScale.min + interval * (index + 1) - 20000, // End position for this stage
          isActive: stage.isActive,
          isDragging: false,
          draggedLine: null, // Tracks which line ("start" or "end") is being dragged
        }));
      } else {        
        // Subsequent Mounts
        stagesRef.current = props.stages.map((stage, index) => ({
            name: stage.name,
            start: stage.start,
            end: stage.end,
            isActive: stage.isActive,
            isDragging: false,
            draggedLine: null, // Tracks which line ("start" or "end") is being dragged
        }));
      }
  
      // Register the line plugin after initialization
      ChartJS.register(linePlugin);
      chart.update()
    }
  }, [props.stages]);

  const linePlugin = {
    id: "linePlugin",
    afterDatasetsDraw: (chart) => {
      const ctx = chart.ctx
      ctx.save();
      stagesRef.current.forEach((stage, index) => {
        const isActive = stage.isActive;
        ctx.strokeStyle = isActive ? "red" : "grey";
        ctx.lineWidth = isActive ? 4 : 2;
        ctx.beginPath();
        const startPosition = chart.scales.x.getPixelForValue(stage.start)
        ctx.moveTo(startPosition, chart.scales.y.top);
        ctx.lineTo(startPosition, chart.scales.y.bottom);
        ctx.stroke();     

        ctx.strokeStyle = isActive ? "blue" : "grey";
        ctx.beginPath();
        const endPosition = chart.scales.x.getPixelForValue(stage.end)
        ctx.moveTo(endPosition, chart.scales.y.top);
        ctx.lineTo(endPosition, chart.scales.y.bottom);
        ctx.stroke();     

        if (true) {
          let centerY = (chart.scales.y.top + chart.scales.y.bottom) / 2;
          ctx.fillStyle = isActive ? "red" : "grey";
          ctx.beginPath();
          ctx.arc(
            startPosition,
            centerY + offset,
            isActive ? offset/2 : offset/3, // Radius of the circle
            Math.PI / 2, // Start angle (North)
            (3 * Math.PI) / 2, // End angle (South)
            true // Counterclockwise direction for right-facing half-circle
          );          
          ctx.fill();
          centerY = (chart.scales.y.top + chart.scales.y.bottom) / 2 + offset;
          ctx.fillStyle = isActive ? "blue" : "grey";          
          ctx.beginPath();
          ctx.arc(
            endPosition,
            centerY - offset,
            isActive ? offset/2 : offset/3, // Radius of the circle
            Math.PI / 2, // Start angle (North)
            (3 * Math.PI) / 2, // End angle (South)
            false // Clockwise direction for left-facing half-circle
          );          
          ctx.fill();
        }
        const startX = chart.scales.x.getPixelForValue(stage.start);
        const endX = chart.scales.x.getPixelForValue(stage.end);

        if (isActive) {
          ctx.fillStyle = "rgba(0, 151, 167, 0.1)";
          ctx.fillRect(startX, chart.scales.y.top, endX - startX, chart.scales.y.bottom - chart.scales.y.top);
        } else {
          ctx.fillStyle = "rgba(162, 164, 168, 0.1)";
          ctx.fillRect(startX, chart.scales.y.top, endX - startX, chart.scales.y.bottom - chart.scales.y.top);
        }
      })
      ctx.restore();
    }
  } 

  const handleMouseDown = (event) => {
    if (!chartRef.current) return;
  
    const chart = chartRef.current;
    const xScale = chart.scales.x;
  
    // Convert mouse X position to chart value
    const mouseX = xScale.getValueForPixel(event.offsetX);
  
    let closestStageIndex = null;
    let closestKey = null; // "start" or "end"
    let closestDistance = Infinity;
  
    stagesRef.current.forEach((stage, index) => {
      const startDistance = Math.abs(stage.start - mouseX);
      const endDistance = Math.abs(stage.end - mouseX);
  
      if (startDistance < closestDistance && stage.isActive) {
        closestDistance = startDistance;
        closestStageIndex = index;
        closestKey = "start";
      }
  
      if (endDistance < closestDistance && stage.isActive) {
        closestDistance = endDistance;
        closestStageIndex = index;
        closestKey = "end";
      }
    });
  
    // If the nearest line is close enough, enable dragging
    if (closestDistance < 50000 && closestStageIndex !== null) {
      stagesRef.current.forEach((stage, index) => {
        stage.isDragging = index === closestStageIndex; // Only one stage can be dragged at a time
        stage.draggedLine = index === closestStageIndex ? closestKey : null; // Track which line is being dragged
      });
      console.log("MOUSE DOWN ---> SELECTED: ", closestStageIndex, closestKey)
    } else {
      console.log("MOUSE DOWN ---> NONE SELECTED")
      console.log("Closest index/distance: ", closestStageIndex, closestKey, closestDistance)
    }
  };  

  const handleMouseUp = () => {
    stagesRef.current.forEach((stage) => {
      stage.isDragging = false; // Reset dragging state
      stage.draggedLine = null; // Clear which line was being dragged
      console.log("MOUSE UP")
    });
    props.onStageUpdate((prevStages) =>
      prevStages.map((stage, index) => ({
        ...stage,
        start: stagesRef.current[index].start, 
        end: stagesRef.current[index].end,
      }))
    );
  };

  const handleMouseMove = (event) => {
    if (!chartRef.current) return;
  
    const chart = chartRef.current;
    const xScale = chart.scales.x;
  
    // Convert mouse X position to chart value
    const newPosition = xScale.getValueForPixel(event.offsetX);
    // Update the position for the active stage and line
    stagesRef.current.forEach((stage, index) => {
      if (stage.isDragging && stage.draggedLine) {
        if (stage.draggedLine === "start") {
        const upperBoundX = stage.end - offset;
        const lowerBoundX = index > 0 ? stagesRef.current[index-1].end : xScale.min;
        if (newPosition > upperBoundX) {
          stage.start = upperBoundX
        } else if (newPosition < lowerBoundX) {
          stage.start = lowerBoundX;
        } else {
          stage.start = newPosition
        }
        } else if (stage.draggedLine === "end") {
          const upperBoundX = index < stagesRef.current.length - 1 ? stagesRef.current[index+1].start - offset : xScale.max;
          const lowerBoundX = stage.start + offset;
          if (newPosition > upperBoundX) {
            stage.end = upperBoundX;
          } else if (newPosition < lowerBoundX) {
            stage.end = lowerBoundX;
          } else {
            stage.end = newPosition;
          }
        }
        chart.update(); // Trigger a redraw
      }
    });
  };

  const handleDoubleClick = (event) => {
    const xScale = chartRef.current.scales.x;
    const clickPosition = xScale.getValueForPixel(event.offsetX);
    stagesRef.current.forEach((stage) => {
      if (clickPosition > stage.start && clickPosition < stage.end) {
        props.onStageUpdate((prevStages) =>
          prevStages.map((prevStage) => ({
            ...prevStage,
            isActive: prevStage.name === stage.name ? true : false
          })))
        return;
      }
    });
  }
  
return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line ref={chartRef} data={props.data} options={props.options} />
      <div style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: "#c2c2c2" }}>
            Tip: Double-click a section to select that reaction stage and drag the lines to adjust the start and end points of each chemical reaction stage.
      </div>
    </div>
  );
};

export default Graph;