const GAS_URL = "https://script.google.com/macros/s/AKfycbxeNw-nT-GnATTog30-aOsWZpfTTNh_M0nluMxRdp6gYfHMLeqEY5pjj9PGEFnElG7U/exec";

const state = {
  part: "",
  score: null,
  trend: "",
  team: "",
  work: "",
  memo: "",
  noPain: false
};

// ======================
// STEP切り替え
// ======================
function showStep(id){
  document.querySelectorAll(".card").forEach(el=>el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ======================
// STEP1（部位）
// ======================
const partBtns = document.querySelectorAll("#partOptions button");
const noPainBtn = document.getElementById("noPainBtn");
const toStep2 = document.getElementById("toStep2");

partBtns.forEach(btn=>{
  btn.onclick = ()=>{
    partBtns.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");

    state.part = btn.dataset.value;
    state.noPain = false;

    toStep2.disabled = false;
  };
});

noPainBtn.onclick = ()=>{
  state.noPain = true;
  state.part = "特にない";

  toStep2.disabled = false;
};

toStep2.onclick = ()=>showStep("step2");

// ======================
// STEP2（スコア）
// ======================
const scoreBtns = document.getElementById("scoreOptions");
const toStep3 = document.getElementById("toStep3");

// スコア生成（1〜5）
[1,2,3,4,5].forEach(n=>{
  const btn = document.createElement("button");
  btn.className = "option-btn";
  btn.textContent = n; // ←ここ重要（1/5じゃなく数字）
  btn.onclick = ()=>{
    state.score = n;
    toStep3.disabled = false;

    document.querySelectorAll("#scoreOptions button")
      .forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
  };
  scoreBtns.appendChild(btn);
});

toStep3.onclick = ()=>showStep("step3");

// ======================
// STEP3（前週比）
// ======================
const trendBtns = document.querySelectorAll("#trendOptions button");
const toStep4 = document.getElementById("toStep4");

trendBtns.forEach(btn=>{
  btn.onclick = ()=>{
    trendBtns.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");

    state.trend = btn.dataset.value;
    toStep4.disabled = false;
  };
});

toStep4.onclick = ()=>{
  state.team = document.getElementById("team").value;
  showStep("step4");
};

// ======================
// STEP4（作業）
// ======================
const workBtns = document.querySelectorAll("#workOptions button");
const toStep5 = document.getElementById("toStep5");

workBtns.forEach(btn=>{
  btn.onclick = ()=>{
    workBtns.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");

    state.work = btn.dataset.value;
    toStep5.disabled = false;
  };
});

toStep5.onclick = ()=>{
  state.memo = document.getElementById("memo").value;

  // 確認表示
  document.getElementById("confirmPart").textContent = state.part;
  document.getElementById("confirmScore").textContent = state.noPain ? "なし" : state.score;
  document.getElementById("confirmTrend").textContent = state.trend;
  document.getElementById("confirmTeam").textContent = state.team || "未入力";
  document.getElementById("confirmWork").textContent = state.work;
  document.getElementById("confirmMemo").textContent = state.memo || "なし";

  showStep("step5");
};

// ======================
// 送信（ここが最重要）
// ======================
document.getElementById("submitBtn").onclick = async ()=>{

  const payload = {
    name: "LINEユーザー",
    userId: "test",
    part: state.part,
    score: state.noPain ? "なし" : state.score,
    trend: state.trend,
    team: state.team,
    work: state.work,
    memo: state.memo
  };

  try{
    const res = await fetch(GAS_URL,{
      method:"POST",
      headers:{
        "Content-Type":"text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log(text);

    document.getElementById("doneMessage").textContent = "送信完了しました";
    document.getElementById("doneSummary").innerHTML =
      `部位：${payload.part}<br>
       痛み：${payload.score}<br>
       前週比：${payload.trend}`;

    showStep("done");

  }catch(e){
    alert("送信エラー：" + e.message);
  }
};

// ======================
document.getElementById("closeBtn").onclick = ()=>{
  location.reload();
};
