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


ChartJS.register(LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = (props) => {
  const barXPosition = useRef(null)
  const chartRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  useEffect(() => {
    const canvas = chartRef.current?.canvas;
  
    if (!canvas) return;
  
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
  
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const xScale = chart.scales.x;
      const midpoint = (xScale.min + xScale.max) / 2; // Calculate midpoint
      const quartile = xScale.min + (xScale.max - xScale.min) / 4; // Calculate midpoint
      barXPosition.current = quartile; // Set the bar position
      ChartJS.register(linePlugin);
    }
  }, []);

  const linePlugin = {
    id: "linePlugin",
    beforeDraw: (chart) => {
      const ctx = chart.ctx
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      const position = chart.scales.x.getPixelForValue(barXPosition.current)
      console.log(position)
      ctx.moveTo(position, chart.scales.y.top);
      ctx.lineTo(position, chart.scales.y.bottom);
      ctx.stroke();     
      ctx.restore();
    }
  } 

  const handleMouseDown = (event) => {
    isDraggingRef.current = true
  }
  
  const handleMouseUp = (event) => {
    isDraggingRef.current = false;
  }

  const handleMouseMove = (event) => {
    if (!isDraggingRef.current || !chartRef.current) return;

    const chart = chartRef.current;
    const xScale = chart.scales.x;
    // console.log("X-Pos, Mouse Drag ", barXPosition.current, event.offsetX);
    const newPosition = xScale.getValueForPixel(event.offsetX);
    if (newPosition >= xScale.min && newPosition <= xScale.max) {
      barXPosition.current = newPosition;
      chart.update();
    }
  };
  
return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line ref={chartRef} data={props.data} options={props.options} />
    </div>
  );
};

export default Graph;