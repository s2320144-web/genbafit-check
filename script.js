const LIFF_ID = "2009527083-MXJru0ta";
const GAS_URL = "https://script.google.com/macros/s/AKfycbxeNw-nT-GnATTog30-aOsWZpfTTNh_M0nluMxRdp6gYfHMLeqEY5pjj9PGEFnElG7U/exec";

const state = {
  part: "",
  score: "",
  trend: "",
  work: "",
  noPain: false
};

// 初期化
window.onload = async () => {
  await liff.init({ liffId: LIFF_ID });
};

// STEP切り替え
function show(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* --------------------
   STEP1
-------------------- */

// 特にない
document.getElementById("noPainBtn").onclick = () => {
  state.noPain = true;
  state.part = "特にない";

  show("step3"); // スキップ
};

// 部位
document.querySelectorAll(".part").forEach(btn => {
  btn.onclick = () => {
    state.part = btn.dataset.value;
    document.getElementById("toStep2").disabled = false;
  };
});

// 次へ
document.getElementById("toStep2").onclick = () => {
  show("step2");
};

/* --------------------
   STEP2
-------------------- */

document.querySelectorAll("[data-score]").forEach(btn => {
  btn.onclick = () => {
    state.score = btn.dataset.score;
    document.getElementById("toStep3").disabled = false;
  };
});

document.getElementById("toStep3").onclick = () => {
  show("step3");
};

/* --------------------
   STEP3
-------------------- */

document.querySelectorAll(".trend").forEach(btn => {
  btn.onclick = () => {
    state.trend = btn.dataset.value;
    document.getElementById("toStep4").disabled = false;
  };
});

document.getElementById("toStep4").onclick = () => {
  show("step4");
};

/* --------------------
   STEP4
-------------------- */

document.querySelectorAll(".work").forEach(btn => {
  btn.onclick = () => {
    state.work = btn.dataset.value;
  };
});

/* --------------------
   送信（LINE + GAS）
-------------------- */

document.getElementById("submitBtn").onclick = async () => {

  try {
    const profile = await liff.getProfile();

    const message =
`【現場fit】
部位：${state.part}
痛み：${state.noPain ? "なし" : state.score}
前週比：${state.trend}
作業：${state.work}`;

    // ✅ LINE送信
    await liff.sendMessages([
      { type: "text", text: message }
    ]);

    // ✅ GAS送信
    await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        name: profile.displayName,
        userId: profile.userId,
        part: state.part,
        score: state.noPain ? "なし" : state.score,
        trend: state.trend,
        work: state.work
      })
    });

    alert("送信完了");

  } catch (e) {
    alert("エラー：" + e.message);
  }
};
