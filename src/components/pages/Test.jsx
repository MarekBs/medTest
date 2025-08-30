import Question from "../Question";
import Footer from "../Footer";
import Stats from "../Stats";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { IoMdPower } from "react-icons/io";
import { useState, useEffect } from "react";
import { FaChartPie } from "react-icons/fa";
import { TfiAlignLeft } from "react-icons/tfi";
import { IoMdPerson } from "react-icons/io";
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

  const changeMode = () => {
    setMode((prev) => !prev);
    if (mode) {
      document.body.style.background = "#FAFAFA";
    } else {
      document.body.style.background = "#212529";
    }
  };

  const changeOffcanvasCloseMode = () => {
    let offcanvas = document.getElementById("offcanvasScrolling");

    if (window.innerWidth < 950) {
      offcanvas.setAttribute("data-bs-backdrop", "true");
    } else {
      offcanvas.setAttribute("data-bs-backdrop", "false");
    }
  };

  useEffect(() => {
    if (user.email) {
      fetchStats();
    }
    setMode(true);
    changeOffcanvasCloseMode();
  }, [user.email]);

  return (
    <div>
      <button
        className={`btn text-light fs-4 ${mode ? "text-light" : "text-dark"}`}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        <TfiAlignLeft />
      </button>

      <div
        className="offcanvas offcanvas-start custom-sidebar"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header ">
          <div className="welcomeMsg d-flex flex-column justify-content-center">
            <IoMdPerson size={25} className="m-auto" />
            <h6 className="m-0 userName">{user.displayName}</h6>
          </div>
        </div>
        <hr />
        <div className="offcanvas-body d-flex flex-column justify-content-center gap-2">
          <button
            onClick={fetchStats}
            data-bs-toggle="modal"
            data-bs-target="#scrollableModal"
            className={`btn  ${mode ? "text-dark" : "text-dark"}`}
          >
            <FaChartPie size={25} />
          </button>
          <hr />
          <div className="form-check form-switch modeWrapper">
            <input
              className="form-check-input toggler"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onChange={changeMode}
              checked={mode ? true : false}
            ></input>
          </div>
          <hr />
          <button
            type="button"
            className="btn-close text-reset mx-auto"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
          <button
            type="button"
            className={`btn mt-auto btn-outline-dark `}
            onClick={handleLogOut}
          >
            <IoMdPower size={20} />
          </button>
        </div>
      </div>

      <Stats mode={mode} stats={stats} email={user.email}></Stats>
      <Question mode={mode} user={user}></Question>
      <Footer></Footer>
    </div>
  );
}

export default Test;
