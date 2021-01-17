import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";

import { fetchDailyDataUSA } from "../../api";

import styles from "./Chart.module.css";

const Chart = ({ data: { confirmed, recovered, deaths }, country }) => {
  const [dailyData, setDailyData] = useState({});

  useEffect(() => {
    const fetchMyAPI = async () => {
      const initialDailyData = await fetchDailyDataUSA();

      setDailyData(initialDailyData);
    };

    fetchMyAPI();
  }, []);

  const totalCases = confirmed
    ? confirmed.value + recovered.value + deaths.value
    : 0;

  const pieChart = confirmed ? (
    <Pie
      data={{
        labels: ["Infected %", "Recovered %", "Deaths %"],
        datasets: [
          {
            label: "Percentage",
            backgroundColor: [
              "rgba(0, 0, 255, 0.5)",
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
            ],
            data: [
              ((confirmed.value / totalCases) * 100).toFixed(2),
              ((recovered.value / totalCases) * 100).toFixed(2),
              ((deaths.value / totalCases) * 100).toFixed(2),
            ],
          },
        ],
      }}
      options={{
        legend: { display: true },
        title: {
          display: true,
          text: `Pie chart of current state in ${country}`,
        },
      }}
    />
  ) : null;

  const barChart = confirmed ? (
    <Bar
      data={{
        labels: ["Infected", "Recovered", "Deaths"],
        datasets: [
          {
            label: "People",
            backgroundColor: [
              "rgba(0, 0, 255, 0.5)",
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
            ],
            data: [confirmed.value, recovered.value, deaths.value],
          },
        ],
      }}
      options={{
        legend: { display: false },
        title: {
          display: true,
          text: `Bar graph of current state in ${country}`,
        },
      }}
    />
  ) : null;

  const lineChart = dailyData[0] ? (
    <Line
      data={{
        labels: dailyData.map(({ date }) =>
          new Date(date).toLocaleDateString()
        ),
        datasets: [
          {
            data: dailyData.map((data) => data.confirmed),
            label: "Infected (USA only)",
            borderColor: "#3333ff",
            fill: true,
          },
          {
            data: dailyData.map((data) => data.deaths),
            label: "Deaths (USA only)",
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true,
          },
          {
            data: dailyData.map((data) => data.recovered),
            label: "Recovered (USA only)",
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.5)",
            fill: true,
          },
        ],
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>
      {country ? [pieChart, <br />, barChart] : lineChart}
    </div>
  );
};

export default Chart;
