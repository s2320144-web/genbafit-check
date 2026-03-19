const LIFF_ID = "2009527083-MXJru0ta";
const GAS_URL = "https://script.google.com/macros/s/AKfycbwkYyPLyzw9p_g6fVOCvuK74SzVJ3evPHOmZ1sxDtCyM2X9c85fUz3MkIxpclcpid9DTw/exec";const state = {
  step: 1,
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

const faceLevels = [
  { value: 1, emoji: "🙂", label: "少し違和感" },
  { value: 2, emoji: "😐", label: "気になる" },
  { value: 3, emoji: "😣", label: "やや強い" },
  { value: 4, emoji: "😖", label: "強い" },
  { value: 5, emoji: "😭", label: "かなり強い" }
];

function textValue(v, other) {
  return v === "その他" ? (other || "その他") : v;
}

function showStep(step) {
  state.step = step;
  ["step1", "step2", "step3", "step4", "step5", "done"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(step === 6 ? "done" : `step${step}`).classList.remove("hidden");
}

function updateStep1() {
  document.querySelectorAll("#partOptions .option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.part && !state.noPain);
  });
  document.getElementById("noPainBtn").classList.toggle("selected", state.noPain);
  document.getElementById("otherPartWrap").classList.toggle("hidden", !(state.part === "その他" && !state.noPain));
  document.getElementById("toStep2").disabled =
    !(state.noPain || (!!state.part && (state.part !== "その他" || !!state.otherPart.trim())));
}

function updateStep2() {
  document.querySelectorAll(".face-btn").forEach(btn => {
    btn.classList.toggle("selected", Number(btn.dataset.value) === state.score);
  });
  document.getElementById("toStep3").disabled = state.score === null;
}

function updateStep3() {
  document.querySelectorAll("#trendOptions .option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.trend);
  });
  document.getElementById("toStep4").disabled = !state.trend;
}

function updateStep4() {
  document.querySelectorAll("#workOptions .option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.work);
  });
  document.getElementById("otherWorkWrap").classList.toggle("hidden", state.work !== "その他");
  document.getElementById("toStep5").disabled =
    !(!!state.work && (state.work !== "その他" || !!state.otherWork.trim()));
}

function updateConfirm() {
  document.getElementById("confirmPart").textContent =
    state.noPain ? "特にない" : textValue(state.part, state.otherPart);

  document.getElementById("confirmScore").textContent =
    state.noPain ? "なし" : `${state.score}/5`;

  document.getElementById("confirmTrend").textContent = state.trend || "未入力";
  document.getElementById("confirmTeam").textContent = state.team || "未入力";
  document.getElementById("confirmWork").textContent = textValue(state.work, state.otherWork);
  document.getElementById("confirmMemo").textContent = state.memo || "なし";
}

function createScoreButtons() {
  const wrap = document.getElementById("scoreOptions");
  wrap.innerHTML = "";

  faceLevels.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "face-btn";
    btn.dataset.value = item.value;
    btn.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <div class="face-label">${item.label}</div>
      <div class="face-score">${item.value}</div>
    `;
    btn.addEventListener("click", () => {
      state.score = item.value;
      updateStep2();
    });
    wrap.appendChild(btn);
  });
}

function bindEvents() {
  document.querySelectorAll("#partOptions .option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.noPain = false;
      state.part = btn.dataset.value;
      state.score = null;
      if (state.part !== "その他") state.otherPart = "";
      updateStep1();
    });
  });

  document.getElementById("noPainBtn").addEventListener("click", () => {
    state.noPain = true;
    state.part = "";
    state.otherPart = "";
    state.score = null;
    state.trend = "";
    updateStep1();
  });

  document.getElementById("otherPart").addEventListener("input", e => {
    state.otherPart = e.target.value;
    updateStep1();
  });

  document.getElementById("toStep2").addEventListener("click", () => {
    if (state.noPain) {
      showStep(3);
    } else {
      showStep(2);
    }
  });

  document.getElementById("toStep3").addEventListener("click", () => {
    showStep(3);
  });

  document.querySelectorAll("#trendOptions .option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.trend = btn.dataset.value;
      updateStep3();
    });
  });

  document.getElementById("team").addEventListener("input", e => {
    state.team = e.target.value;
  });

  document.getElementById("toStep4").addEventListener("click", () => {
    showStep(4);
  });

  document.querySelectorAll("#workOptions .option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.work = btn.dataset.value;
      if (state.work !== "その他") state.otherWork = "";
      updateStep4();
    });
  });

  document.getElementById("otherWork").addEventListener("input", e => {
    state.otherWork = e.target.value;
    updateStep4();
  });

  document.getElementById("memo").addEventListener("input", e => {
    state.memo = e.target.value;
  });

  document.getElementById("toStep5").addEventListener("click", () => {
    updateConfirm();
    showStep(5);
  });

  document.querySelectorAll(".back").forEach(btn => {
    btn.addEventListener("click", () => {
      showStep(Number(btn.dataset.back));
    });
  });

  document.getElementById("submitBtn").addEventListener("click", async () => {
    const partText = state.noPain ? "特にない" : textValue(state.part, state.otherPart);
    const scoreText = state.noPain ? "なし" : `${state.score}/5`;
    const trendText = state.trend || "未入力";
    const teamText = state.team || "未入力";
    const workText = textValue(state.work, state.otherWork);
    const memoText = state.memo || "なし";

    const resultMessage =
`【現場fit チェック】
部位：${partText}
痛み：${scoreText}
前週比：${trendText}
班・工区：${teamText}
作業：${workText}
補足：${memoText}`;

    try {
      if (typeof liff === "undefined") {
        alert("LIFFが読み込まれていません");
        return;
      }

      if (!liff.isInClient()) {
        alert("LINEアプリ内で開いてください");
        return;
      }

      if (!liff.isLoggedIn()) {
        alert("LINEからもう一度開き直してください");
        return;
      }

      await liff.sendMessages([
        {
          type: "text",
          text: resultMessage
        }
      ]);
// スプレッドシート送信
fetch(GAS_URL, {
  method: "POST",
  body: JSON.stringify({
    name: "匿名",
    userId: "test",
    part: partText,
    score: scoreText,
    trend: trendText,
    team: teamText,
    work: workText,
    memo: memoText
  })
});      document.getElementById("doneMessage").textContent =
        !state.noPain && (state.score >= 4 || state.trend === "悪くなった")
          ? "入力ありがとうございました。負担が強い可能性があります。必要に応じて早めの相談を検討してください。"
          : "入力ありがとうございました。内容は現場改善と再発防止に活用されます。";

      document.getElementById("doneSummary").innerHTML =
        `部位：${partText}<br>
         痛み：${scoreText}<br>
         前週比：${trendText}<br>
         班・工区：${teamText}<br>
         作業：${workText}<br>
         補足：${memoText}`;

      showStep(6);
    } catch (error) {
      console.error("sendMessages error:", error);
      alert("送信に失敗しました: " + error.message);
    }
  });

  document.getElementById("closeBtn").addEventListener("click", () => {
    if (typeof liff !== "undefined" && liff.isInClient()) {
      liff.closeWindow();
    } else {
      showStep(1);
    }
  });
}

async function initLiff() {
  try {
    if (typeof liff === "undefined") {
      alert("LIFF SDKが読み込まれていません");
      return;
    }

    await liff.init({ liffId: LIFF_ID });

    console.log("LIFF init success", {
      inClient: liff.isInClient(),
      loggedIn: liff.isLoggedIn(),
      url: location.href
    });
  } catch (error) {
    console.error("LIFF init error:", error);
    alert("LIFF初期化エラー: " + (error.message || JSON.stringify(error)));
  }
}

window.onload = async function () {
  createScoreButtons();
  bindEvents();
  updateStep1();
  updateStep2();
  updateStep3();
  updateStep4();
  showStep(1);
  await initLiff();
};
