import Question from "../Question";
import Footer from "../Footer";
import Stats from "../Stats";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { FaChartPie } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // správna cesta k firebase config

function Test({ user }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(false);

  const handleLogOut = async () => {
    try {
      await signOut(auth); // odhlásenie
      navigate("/", { replace: true }); // presmeruj na login
    } catch (error) {
      console.error("Chyba pri odhlaseni:", error);
    }
  };

  const [stats, setStats] = useState({
    bio: { spravne: 0, nespravne: 0 },
    che: { spravne: 0, nespravne: 0 },
  });
  async function fetchStats() {
  const tests = ["bio", "che"];
  const newStats = {};

  // priprav spoločné počítadlo pre všetky testy spolu
  const poslednych7dni = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const globalCountsPerDay = {};
  poslednych7dni.forEach((day) => {
    globalCountsPerDay[day] = 0;
  });

  for (const test of tests) {
    const testDocRef = doc(db, "users", user.email, "tests", test);
    const testDocSnap = await getDoc(testDocRef);

    if (testDocSnap.exists()) {
      const data = testDocSnap.data();
      const odpovede = data?.odpovede ?? [];

      let spravne = 0;
      let nespravne = 0;

      odpovede.forEach((odpoved) => {
        if (odpoved?.spravna === true) spravne++;
        else nespravne++;

        if (odpoved?.timestamp) {
          const date = new Date(odpoved.timestamp);
          const isoDay = date.toISOString().slice(0, 10);
          if (poslednych7dni.includes(isoDay)) {
            globalCountsPerDay[isoDay]++; // SPOLOČNÉ inkrementovanie
          }
        }
      });

      newStats[test] = {
        spravne,
        nespravne,
      };
    } else {
      newStats[test] = {
        spravne: 0,
        nespravne: 0,
      };
    }
  }

  // pridaj globalne počítadlo za posledných 7 dní do `newStats` ako extra kľúč
  newStats["answersLast7Days"] = globalCountsPerDay;

  setStats(newStats);
}


  useEffect(() => {
    

    if (user.email) {
      fetchStats();
    }
  }, [user.email]);

  return (
    <div>
      <div className="loginMenu">
        <h5 className="welcomeMsg pt-1 m-0">Vitaj {user.displayName}</h5>
        <button
          type="button"
          className={`btn ${
            mode ? "btn-dark" : "btn-light"
          } d-flex  align-items-center gap-1 ms-2`}
          onClick={handleLogOut}
        >
          <FiLogOut size={20} />
          Odhlásiť sa
        </button>
        <button
          onClick={fetchStats}
          data-bs-toggle="modal"
          data-bs-target="#scrollableModal"
          className={`btn ${
            mode ? "btn-dark" : "btn-light"
          } d-flex  align-items-center gap-1 ms-2`}
        >
          <FaChartPie size={25} />
        </button>
      </div>
      <Stats stats={stats} email={user.email}></Stats>
      <Question mode={mode} user={user} setMode={setMode}></Question>
      <Footer></Footer>
    </div>
  );
}

export default Test;
