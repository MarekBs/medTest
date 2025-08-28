import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // správna cesta k firebase config

// import Chart.js komponenty
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Stats({ email, stats, mode }) {
  // Dáta pre koláčové grafy
  const dataBio = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Bio odpovede",
        data: [stats.bio.spravne, stats.bio.nespravne],
        backgroundColor: ["#4bc0c0", "#808080"], // zelená a červená
        hoverOffset: 25,
        offset: 15,
      },
    ],
  };

  const dataChe = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Che odpovede",
        data: [stats.che.spravne, stats.che.nespravne],
        backgroundColor: ["#4bc0c0", "#808080"],
        hoverOffset: 25,
        offset: 15,
      },
    ],
  };

  const dataAll = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Všetky odpovede",
        data: [
          stats.che.spravne + stats.bio.spravne,
          stats.che.nespravne + stats.bio.nespravne,
        ],
        backgroundColor: ["#bbdb44", "#CD5C5C"],
        hoverOffset: 25,
        offset: 15,
      },
    ],
  };
  return (
    <div
      className="modal fade"
      id="scrollableModal"
      tabIndex="-1"
      aria-labelledby="scrollableModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className={`modal-content modalStyle ${
            mode ? "bg-dark text-light" : "bg-light text-dark"
          }`}>
          <div className={`modal-header border-secondary`}>
            <h5 className="modal-title" id="scrollableModalLabel">
              Štatistika
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Zavrieť"
            ></button>
          </div>
          <div className="modal-body">
            <div className="modalCntnt">
              <div className="text-center">
                <h6>Všetky odpovede</h6>
                <div className="pieGraph">
                  <Pie
                    key={Date.now()}
                    data={dataAll}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      elements: {
                        arc: {
                          borderWidth: 0, // toto odstráni border jednotlivých slice
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "white",
                          },
                        },
                        datalabels: {
                          color: "black", // farba čísel
                          font: {
                            size: 20,
                          },
                          formatter: (value, context) => {
                            return value; // alebo `${value}%` ak chceš percentá
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="text-center graphHolder">
                <h6>Biológia</h6>
                <div className="pieGraph">
                  <Pie
                    key={Date.now()}
                    data={dataBio}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      elements: {
                        arc: {
                          borderWidth: 0, // toto odstráni border jednotlivých slice
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "white",
                          },
                        },
                        datalabels: {
                          color: "black", // farba čísel
                          font: {
                            size: 20,
                          },
                          formatter: (value, context) => {
                            return value; // alebo `${value}%` ak chceš percentá
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="text-center graphHolder">
                <h6>Chémia</h6>
                <div className="pieGraph">
                  <Pie
                    key={Date.now()}
                    data={dataChe}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      elements: {
                        arc: {
                          borderWidth: 0, // toto odstráni border jednotlivých slice
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "white",
                          },
                        },
                        datalabels: {
                          color: "black", // farba čísel
                          font: {
                            size: 20,
                          },
                          formatter: (value, context) => {
                            return value; // alebo `${value}%` ak chceš percentá
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <br />
            <hr />
            <br />
            <div className="barChart">
              <h6 className="text-center mb-3">
                Počet zodpovedaných otázok za posledných 7 dní
              </h6>
              <Bar
                key={Date.now()}
                data={{
                  labels: Object.keys(stats.answersLast7Days || {}).map((d) =>
                    d.slice(5)
                  ), // MM-DD
                  datasets: [
                    {
                      label: "Počet odpovedí za deň",
                      data: Object.values(stats.answersLast7Days || {}),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    datalabels: {
                      color: "white",
                      font: { size: 14 },
                      anchor: "end",
                      align: "top",
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "white" },
                      grid: { color: "rgba(255,255,255,0.1)" },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: "white", stepSize: 1, precision: 0 },
                      grid: { color: "rgba(255,255,255,0.1)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
