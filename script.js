const LIFF_ID = "2009527083-MXJru0ta";
const GAS_URL = "https://script.google.com/macros/s/AKfycbxeNw-nT-GnATTog30-aOsWZpfTTNh_M0nluMxRdp6gYfHMLeqEY5pjj9PGEFnElG7U/exec";

const state = {
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
  { value: 5, emoji: "😫", label: "かなり強い" }
];

function textValue(v, other) {
  return v === "その他" ? (other || "その他") : v;
}

function showStep(step) {
  document.querySelectorAll(".card").forEach((card) => card.classList.add("hidden"));
  const target = document.getElementById(step === 6 ? "done" : `step${step}`);
  if (target) target.classList.remove("hidden");
  state.step = step;
}

function clearSelected(elements) {
  elements.forEach((el) => el.classList.remove("selected"));
}

function createScoreOptions() {
  const wrap = document.getElementById("scoreOptions");
  wrap.innerHTML = "";

  faceLevels.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.dataset.value = String(item.value);
    btn.innerHTML = `
      <div style="font-size:32px; margin-bottom:8px;">${item.emoji}</div>
      <div style="font-weight:700;">${item.value}/5</div>
      <div style="font-size:12px; opacity:0.8;">${item.label}</div>
    `;

    btn.addEventListener("click", () => {
      state.score = item.value;
      clearSelected([...wrap.querySelectorAll(".option-btn")]);
      btn.classList.add("selected");
      document.getElementById("toStep3").disabled = false;
    });

    wrap.appendChild(btn);
  });
}

async function initLiff() {
  try {
    if (typeof liff === "undefined") return;
    await liff.init({ liffId: LIFF_ID });
  } catch (error) {
    console.error("LIFF init error:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initLiff();
  createScoreOptions();

  const noPainBtn = document.getElementById("noPainBtn");
  const partButtons = [...document.querySelectorAll("#partOptions .option-btn")];
  const otherPartWrap = document.getElementById("otherPartWrap");
  const otherPartInput = document.getElementById("otherPart");
  const toStep2 = document.getElementById("toStep2");

  const trendButtons = [...document.querySelectorAll("#trendOptions .option-btn")];
  const teamInput = document.getElementById("team");
  const toStep4 = document.getElementById("toStep4");

  const workButtons = [...document.querySelectorAll("#workOptions .option-btn")];
  const otherWorkWrap = document.getElementById("otherWorkWrap");
  const otherWorkInput = document.getElementById("otherWork");
  const memoInput = document.getElementById("memo");
  const toStep5 = document.getElementById("toStep5");

  const submitBtn = document.getElementById("submitBtn");
  const closeBtn = document.getElementById("closeBtn");

  const backButtons = [...document.querySelectorAll(".back")];

  noPainBtn.addEventListener("click", () => {
    state.noPain = true;
    state.part = "特にない";
    state.otherPart = "";
    otherPartInput.value = "";
    otherPartWrap.classList.add("hidden");

    clearSelected(partButtons);
    noPainBtn.classList.add("selected");
    toStep2.disabled = false;
  });

  partButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;

      state.noPain = false;
      state.part = value;
      noPainBtn.classList.remove("selected");

      clearSelected(partButtons);
      btn.classList.add("selected");

      if (value === "その他") {
        otherPartWrap.classList.remove("hidden");
        toStep2.disabled = otherPartInput.value.trim() === "";
      } else {
        otherPartWrap.classList.add("hidden");
        state.otherPart = "";
        otherPartInput.value = "";
        toStep2.disabled = false;
      }
    });
  });

  otherPartInput.addEventListener("input", () => {
    state.otherPart = otherPartInput.value.trim();
    if (state.part === "その他") {
      toStep2.disabled = state.otherPart === "";
    }
  });

  toStep2.addEventListener("click", () => {
    if (!state.part) return;

    if (state.noPain) {
      state.score = null;
      state.trend = "";
      teamInput.value = "";
      state.team = "";
      showStep(4);
      return;
    }

    showStep(2);
  });

  trendButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.trend = btn.dataset.value;
      clearSelected(trendButtons);
      btn.classList.add("selected");
      toStep4.disabled = false;
    });
  });

  teamInput.addEventListener("input", () => {
    state.team = teamInput.value.trim();
  });

  document.getElementById("toStep3").addEventListener("click", () => {
    if (state.score == null) return;
    showStep(3);
  });

  document.getElementById("toStep4").addEventListener("click", () => {
    if (!state.trend) return;
    showStep(4);
  });

  workButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;
      state.work = value;

      clearSelected(workButtons);
      btn.classList.add("selected");

      if (value === "その他") {
        otherWorkWrap.classList.remove("hidden");
        toStep5.disabled = otherWorkInput.value.trim() === "";
      } else {
        otherWorkWrap.classList.add("hidden");
        state.otherWork = "";
        otherWorkInput.value = "";
        toStep5.disabled = false;
      }
    });
  });

  otherWorkInput.addEventListener("input", () => {
    state.otherWork = otherWorkInput.value.trim();
    if (state.work === "その他") {
      toStep5.disabled = state.otherWork === "";
    }
  });

  memoInput.addEventListener("input", () => {
    state.memo = memoInput.value.trim();
  });

  toStep5.addEventListener("click", () => {
    if (!state.work) return;

    const partText = state.noPain ? "特にない" : textValue(state.part, state.otherPart);
    const scoreText = state.noPain ? "なし" : `${state.score}/5`;
    const trendText = state.noPain ? "なし" : (state.trend || "未入力");
    const teamText = state.team || "未入力";
    const workText = textValue(state.work, state.otherWork);
    const memoText = state.memo || "なし";

    document.getElementById("confirmPart").textContent = partText;
    document.getElementById("confirmScore").textContent = scoreText;
    document.getElementById("confirmTrend").textContent = trendText;
    document.getElementById("confirmTeam").textContent = teamText;
    document.getElementById("confirmWork").textContent = workText;
    document.getElementById("confirmMemo").textContent = memoText;

    showStep(5);
  });

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const backTo = Number(btn.dataset.back);
      if (backTo) showStep(backTo);
    });
  });

  submitBtn.addEventListener("click", async () => {
    const partText = state.noPain ? "特にない" : textValue(state.part, state.otherPart);
    const scoreText = state.noPain ? "なし" : `${state.score}/5`;
    const trendText = state.noPain ? "なし" : (state.trend || "未入力");
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

      const profile = await liff.getProfile();

      await liff.sendMessages([
        {
          type: "text",
          text: resultMessage
        }
      ]);

      const payload = {
        name: profile.displayName || "",
        userId: profile.userId || "",
        part: partText,
        score: scoreText,
        trend: trendText,
        team: teamText,
        work: workText,
        memo: memoText
      };

      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      console.log("GAS response:", text);

      document.getElementById("doneMessage").textContent =
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
      console.error("送信エラー:", error);
      alert("送信に失敗しました: " + (error.message || JSON.stringify(error)));
    }
  });

  closeBtn.addEventListener("click", () => {
    if (typeof liff !== "undefined" && liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.close();
    }
  });
});
