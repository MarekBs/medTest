import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // správna cesta k firebase config

// import Chart.js komponenty
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels );

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

          odpovede.forEach((odpoved) => {
            if (odpoved?.spravna === true) spravne++;
            else nespravne++;
          });

          newStats[test] = { spravne, nespravne };
        } else {
          newStats[test] = { spravne: 0, nespravne: 0 };
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
        backgroundColor: ["#43a047", "#ef5350"], // zelená a červená
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
        backgroundColor: ["#43a047", "#ef5350"], // modrá a oranžová
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
            <h6>Biológia</h6>
            <div className="pieGraph" >
            <Pie
              data={dataBio}
              options={{
                responsive: true,
                maintainAspectRatio: false,
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
                      weight: 'bold',
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
                      weight: 'bold',
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


