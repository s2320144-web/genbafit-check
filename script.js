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

function textValue(v, other) {
  return v === "その他" ? (other || "その他") : v;
}

function showStep(step) {
  document.querySelectorAll(".card").forEach(card => card.classList.add("hidden"));
  if (step === 6) {
    document.getElementById("done").classList.remove("hidden");
  } else {
    document.getElementById(`step${step}`).classList.remove("hidden");
  }
}

function clearSelected(elements) {
  elements.forEach(el => el.classList.remove("selected"));
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

  const noPainBtn = document.getElementById("noPainBtn");
  const partBtns = [...document.querySelectorAll("#partOptions .option-btn")];
  const toStep2 = document.getElementById("toStep2");
  const otherPartWrap = document.getElementById("otherPartWrap");
  const otherPartInput = document.getElementById("otherPart");

  const scoreWrap = document.getElementById("scoreOptions");
  const toStep3 = document.getElementById("toStep3");

  const trendBtns = [...document.querySelectorAll("#trendOptions .option-btn")];
  const toStep4 = document.getElementById("toStep4");
  const teamInput = document.getElementById("team");

  const workBtns = [...document.querySelectorAll("#workOptions .option-btn")];
  const toStep5 = document.getElementById("toStep5");
  const otherWorkWrap = document.getElementById("otherWorkWrap");
  const otherWorkInput = document.getElementById("otherWork");
  const memoInput = document.getElementById("memo");

  const submitBtn = document.getElementById("submitBtn");
  const closeBtn = document.getElementById("closeBtn");

  function resetPart() {
    noPainBtn.classList.remove("selected");
    clearSelected(partBtns);
  }

  noPainBtn.addEventListener("click", () => {
    resetPart();
    state.noPain = true;
    state.part = "特にない";
    state.otherPart = "";
    otherPartInput.value = "";
    otherPartWrap.classList.add("hidden");
    noPainBtn.classList.add("selected");
    toStep2.disabled = false;
  });

  partBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      resetPart();
      const val = btn.dataset.value;
      state.noPain = false;
      state.part = val;
      btn.classList.add("selected");

      if (val === "その他") {
        otherPartWrap.classList.remove("hidden");
        toStep2.disabled = otherPartInput.value.trim() === "";
      } else {
        state.otherPart = "";
        otherPartInput.value = "";
        otherPartWrap.classList.add("hidden");
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
    } else {
      showStep(2);
    }
  });

  scoreWrap.innerHTML = "";
  [1, 2, 3, 4, 5].forEach(n => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn large";
    btn.textContent = String(n);

    btn.addEventListener("click", () => {
      state.score = n;
      clearSelected([...scoreWrap.querySelectorAll(".option-btn")]);
      btn.classList.add("selected");
      toStep3.disabled = false;
    });

    scoreWrap.appendChild(btn);
  });

  toStep3.addEventListener("click", () => {
    if (state.score == null) return;
    showStep(3);
  });

  trendBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      state.trend = btn.dataset.value;
      clearSelected(trendBtns);
      btn.classList.add("selected");
      toStep4.disabled = false;
    });
  });

  teamInput.addEventListener("input", () => {
    state.team = teamInput.value.trim();
  });

  toStep4.addEventListener("click", () => {
    if (!state.trend) return;
    showStep(4);
  });

  workBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.value;
      state.work = val;
      clearSelected(workBtns);
      btn.classList.add("selected");

      if (val === "その他") {
        otherWorkWrap.classList.remove("hidden");
        toStep5.disabled = otherWorkInput.value.trim() === "";
      } else {
        state.otherWork = "";
        otherWorkInput.value = "";
        otherWorkWrap.classList.add("hidden");
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
    const scoreText = state.noPain ? "なし" : String(state.score);
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

  document.querySelectorAll(".back").forEach(btn => {
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
      if (typeof liff !== "undefined" && liff.isInClient() && liff.isLoggedIn()) {
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
      } else {
        const payload = {
          name: "",
          userId: "",
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
      }

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

  showStep(1);
});
