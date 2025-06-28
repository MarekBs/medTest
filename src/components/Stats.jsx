import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // správna cesta k firebase config

// import Chart.js komponenty
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

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
        backgroundColor: ["#4CAF50", "#F44336"], // zelená a červená
        hoverOffset: 20,
      },
    ],
  };

  const dataChe = {
    labels: ["Správne", "Nesprávne"],
    datasets: [
      {
        label: "Che odpovede",
        data: [stats.che.spravne, stats.che.nespravne],
        backgroundColor: ["#2196F3", "#FF9800"], // modrá a oranžová
        hoverOffset: 20,
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
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content bg-dark text-light">
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
            <h6>Bio</h6>
            <div style={{ width: 350, height: 350, margin: "auto", }}>
            <Pie data={dataBio} 
                options={{
                responsive: true,
                maintainAspectRatio: false,
                radius: '80%',
            }}/>
            </div>
            <hr />
            <h6>Che</h6>
            <div style={{ width: 350, height: 350, margin: "auto", }}>
            <Pie data={dataChe} 
                options={{
                responsive: true,
                maintainAspectRatio: false,
                radius: '80%',
            }}/>
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


