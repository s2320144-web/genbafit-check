const LIFF_ID = "2009527083-MXJru0ta";
const GAS_URL = "https://script.google.com/macros/s/AKfycbxeNw-nT-GnATTog30-aOsWZpfTTNh_M0nluMxRdp6gYfHMLeqEY5pjj9PGEFnElG7U/exec";

const state = {
  noPain: false,
  part: "",
  otherPart: "",
  score: null,
  trend: "",
  team: "",
  work: "",
  otherWork: "",
  memo: ""
};

function showStep(step) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
  document.getElementById("step" + step)?.classList.remove("hidden");
  if (step === 6) document.getElementById("done").classList.remove("hidden");
}

function clearSelected(list) {
  list.forEach(el => el.classList.remove("selected"));
}

document.addEventListener("DOMContentLoaded", async () => {

  // ===== STEP1 =====
  const noPainBtn = document.getElementById("noPainBtn");
  const partBtns = [...document.querySelectorAll("#partOptions .option-btn")];
  const toStep2 = document.getElementById("toStep2");
  const otherPartWrap = document.getElementById("otherPartWrap");
  const otherPartInput = document.getElementById("otherPart");

  noPainBtn.onclick = () => {
    state.noPain = true;
    state.part = "特にない";
    clearSelected(partBtns);
    noPainBtn.classList.add("selected");
    toStep2.disabled = false;
  };

  partBtns.forEach(btn => {
    btn.onclick = () => {
      state.noPain = false;
      state.part = btn.dataset.value;

      clearSelected(partBtns);
      noPainBtn.classList.remove("selected");
      btn.classList.add("selected");

      if (btn.dataset.value === "その他") {
        otherPartWrap.classList.remove("hidden");
        toStep2.disabled = true;
      } else {
        otherPartWrap.classList.add("hidden");
        toStep2.disabled = false;
      }
    };
  });

  otherPartInput.oninput = () => {
    state.otherPart = otherPartInput.value;
    toStep2.disabled = !state.otherPart;
  };

  toStep2.onclick = () => showStep(2);

  // ===== STEP2 =====
  const scoreWrap = document.getElementById("scoreOptions");
  const toStep3 = document.getElementById("toStep3");

  [1,2,3,4,5].forEach(n => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = n + "/5";
    btn.onclick = () => {
      state.score = n;
      clearSelected([...scoreWrap.children]);
      btn.classList.add("selected");
      toStep3.disabled = false;
    };
    scoreWrap.appendChild(btn);
  });

  toStep3.onclick = () => showStep(3);

  // ===== STEP3 =====
  const trendBtns = [...document.querySelectorAll("#trendOptions .option-btn")];
  const toStep4 = document.getElementById("toStep4");
  const teamInput = document.getElementById("team");

  trendBtns.forEach(btn => {
    btn.onclick = () => {
      state.trend = btn.dataset.value;
      clearSelected(trendBtns);
      btn.classList.add("selected");
      toStep4.disabled = false;
    };
  });

  teamInput.oninput = () => state.team = teamInput.value;

  toStep4.onclick = () => showStep(4);

  // ===== STEP4 =====
  const workBtns = [...document.querySelectorAll("#workOptions .option-btn")];
  const toStep5 = document.getElementById("toStep5");
  const otherWorkWrap = document.getElementById("otherWorkWrap");
  const otherWorkInput = document.getElementById("otherWork");
  const memoInput = document.getElementById("memo");

  workBtns.forEach(btn => {
    btn.onclick = () => {
      state.work = btn.dataset.value;
      clearSelected(workBtns);
      btn.classList.add("selected");

      if (btn.dataset.value === "その他") {
        otherWorkWrap.classList.remove("hidden");
        toStep5.disabled = true;
      } else {
        otherWorkWrap.classList.add("hidden");
        toStep5.disabled = false;
      }
    };
  });

  otherWorkInput.oninput = () => {
    state.otherWork = otherWorkInput.value;
    toStep5.disabled = !state.otherWork;
  };

  memoInput.oninput = () => state.memo = memoInput.value;

  toStep5.onclick = () => {
    document.getElementById("confirmPart").textContent =
      state.noPain ? "特にない" : (state.part === "その他" ? state.otherPart : state.part);

    document.getElementById("confirmScore").textContent =
      state.noPain ? "なし" : state.score + "/5";

    document.getElementById("confirmTrend").textContent =
      state.noPain ? "なし" : state.trend;

    document.getElementById("confirmTeam").textContent = state.team || "未入力";

    document.getElementById("confirmWork").textContent =
      state.work === "その他" ? state.otherWork : state.work;

    document.getElementById("confirmMemo").textContent = state.memo || "なし";

    showStep(5);
  };

  // ===== 戻る =====
  document.querySelectorAll(".back").forEach(btn => {
    btn.onclick = () => showStep(btn.dataset.back);
  });

  // ===== 送信 =====
  document.getElementById("submitBtn").onclick = async () => {
    const partText = state.noPain ? "特にない" : (state.part === "その他" ? state.otherPart : state.part);

    const payload = {
      name: "",
      userId: "",
      part: partText,
      score: state.noPain ? "なし" : state.score + "/5",
      trend: state.noPain ? "なし" : state.trend,
      team: state.team,
      work: state.work === "その他" ? state.otherWork : state.work,
      memo: state.memo
    };

    await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    document.getElementById("doneMessage").textContent = "送信完了しました";
    showStep(6);
  };

  // ===== 閉じる =====
  document.getElementById("closeBtn").onclick = () => window.close();
});
