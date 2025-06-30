import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // správna cesta k firebase config

// import Chart.js komponenty
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement );





export default function Stats({ email }) {
  const [stats, setStats] = useState({
    bio: { spravne: 0, nespravne: 0 },
    che: { spravne: 0, nespravne: 0 },
  });

  useEffect(() => {
  async function fetchStats() {
    const tests = ["bio", "che"];
    const newStats = {};

    for (const test of tests) {
      const testDocRef = doc(db, "users", email, "tests", test);
      const testDocSnap = await getDoc(testDocRef);

      if (testDocSnap.exists()) {
        const data = testDocSnap.data();
        const odpovede = data?.odpovede ?? [];

        let spravne = 0;
        let nespravne = 0;

        // inicializuj dni za posledných 7 dní
        const poslednych7dni = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().slice(0, 10); // YYYY-MM-DD
        });

        const countsPerDay = {};
        poslednych7dni.forEach(day => {
          countsPerDay[day] = 0;
        });

        odpovede.forEach((odpoved) => {
          if (odpoved?.spravna === true) spravne++;
          else nespravne++;

          if (odpoved?.timestamp) {
            const date = new Date(odpoved.timestamp);
            const isoDay = date.toISOString().slice(0, 10);
            if (poslednych7dni.includes(isoDay)) {
              countsPerDay[isoDay]++;
            }
          }
        });

        newStats[test] = {
          spravne,
          nespravne,
          answersLast7Days: countsPerDay
        };
      } else {
        newStats[test] = {
          spravne: 0,
          nespravne: 0,
          answersLast7Days: {}
        };
      }
    }

    setStats(newStats);
  }

  if (email) {
    fetchStats();
  }
}, [email]);


  // Dáta pre koláčové grafy
  const dataBio = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Bio odpovede",
        data: [stats.bio.spravne, stats.bio.nespravne],
        backgroundColor: ["#4bc0c0", "#808080"], // zelená a červená
        hoverOffset: 25,
        offset: 15
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
        offset: 15
      },
    ],
  };

  const dataAll = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Všetky odpovede",
        data: [stats.che.spravne + stats.bio.spravne, stats.che.nespravne + stats.bio.nespravne],
        backgroundColor: ["#bbdb44", "#CD5C5C"], 
        hoverOffset: 25,
        offset: 15
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
        <div className="modal-content modalStyle text-light">
          <div className="modal-header border-secondary">
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
            <div className="text-center">
            <h6>Všetky odpovede</h6>
            <div className="pieGraph" >
            <Pie
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
                    position: 'bottom',
                    labels: {
                      color: 'white',
                    },
                  },
                  datalabels: {
                    color: 'black', // farba čísel
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
            <div className="pieGraph" >
            <Pie
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
                    position: 'bottom',
                    labels: {
                      color: 'white',
                    },
                  },
                  datalabels: {
                    color: 'black', // farba čísel
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
            <hr />
            <div className="text-center">
            <h6>Chémia</h6>
            <div className="pieGraph">
            <Pie
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
                    position: 'bottom',
                    labels: {
                      color: 'white',
                    },
                  },
                  datalabels: {
                    color: 'black', // farba čísel
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
          
          <div className="barChart">
            <h6 className="text-center">Počet otázok za posledných 7 dní</h6>
            <Bar
              data={{
                labels: Object.keys(stats.che.answersLast7Days || {}).map(d => d.slice(5)), // MM-DD
                datasets: [
                  {
                    label: "Počet odpovedí za deň",
                    data: Object.values(stats.bio.answersLast7Days || {}),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderRadius: 6
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  datalabels: {
                    color: "white",
                    font: { size: 14 },
                    anchor: "end",
                    align: "top"
                  }
                },
                scales: {
                  x: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { color: "white", stepSize: 1, precision: 0 },
                    grid: { color: "rgba(255,255,255,0.1)" }
                  }
                }
              }}
            />
          </div>
          <div className="modal-footer border-secondary">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Zavrieť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}