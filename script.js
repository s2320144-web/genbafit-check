const LIFF_ID = "2009527083-GI7XhhzG";

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

// =========================
// 🔥 LIFF 初期化（最重要）
// =========================
async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    console.log("LIFFログイン成功");

  } catch (error) {
    console.error("LIFF init error:", error);
    alert("LIFF初期化エラー");
  }
}

// =========================
// UI制御
// =========================
function showStep(step) {
  state.step = step;
  ["step1", "step2", "step3", "step4", "step5", "done"].forEach(id => {
    document.getElementById(id)?.classList.add("hidden");
  });
  document.getElementById(step === 6 ? "done" : `step${step}`)?.classList.remove("hidden");
}

// =========================
// 送信処理
// =========================
async function sendData() {
  try {
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const message = `
【現場fitチェック】
部位: ${state.noPain ? "特になし" : state.part}
痛み: ${state.score || "なし"}
前週比: ${state.trend}
作業: ${state.work}
メモ: ${state.memo}
`;

    await liff.sendMessages([
      {
        type: "text",
        text: message
      }
    ]);

    alert("送信完了");
    liff.closeWindow();

  } catch (error) {
    console.error(error);
    alert("送信失敗: " + error.message);
  }
}

// =========================
// 初期化
// =========================
initLiff();
showStep(1);
