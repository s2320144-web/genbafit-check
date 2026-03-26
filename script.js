const GAS_URL = "https://script.google.com/macros/s/AKfycbxeNw-nT-GnATTog30-aOsWZpfTTNh_M0nluMxRdp6gYfHMLeqEY5pjj9PGEFnElG7U/exec";

const state = {};

function show(id) {
  ["step1","step2","step3","step4","step5","done"].forEach(s=>{
    document.getElementById(s).style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// ===== STEP1 =====
const toStep2 = document.getElementById("toStep2");

document.querySelectorAll("[data-value]").forEach(btn=>{
  btn.onclick = ()=>{
    state.part = btn.dataset.value;

    if(btn.dataset.value==="その他"){
      document.getElementById("otherPartWrap").style.display="block";
      toStep2.disabled=true;
    }else{
      document.getElementById("otherPartWrap").style.display="none";
      toStep2.disabled=false;
    }
  };
});

document.getElementById("otherPart").oninput=()=>{
  state.otherPart = otherPart.value;
  toStep2.disabled=!state.otherPart;
};

document.getElementById("noPainBtn").onclick=()=>{
  state.part="特にない";
  toStep2.disabled=false;
};

toStep2.onclick=()=>show("step2");

// ===== STEP2 =====
const toStep3=document.getElementById("toStep3");

document.querySelectorAll("[data-score]").forEach(btn=>{
  btn.onclick=()=>{
    state.score=btn.dataset.score;
    toStep3.disabled=false;
  };
});

toStep3.onclick=()=>show("step3");

// ===== STEP3 =====
const toStep4=document.getElementById("toStep4");

document.querySelectorAll("[data-trend]").forEach(btn=>{
  btn.onclick=()=>{
    state.trend=btn.dataset.trend;
    toStep4.disabled=false;
  };
});

toStep4.onclick=()=>show("step4");

// ===== STEP4 =====
const toStep5=document.getElementById("toStep5");

document.querySelectorAll("[data-work]").forEach(btn=>{
  btn.onclick=()=>{
    state.work=btn.dataset.work;

    if(btn.dataset.work==="その他"){
      document.getElementById("otherWorkWrap").style.display="block";
      toStep5.disabled=true;
    }else{
      document.getElementById("otherWorkWrap").style.display="none";
      toStep5.disabled=false;
    }
  };
});

document.getElementById("otherWork").oninput=()=>{
  state.otherWork=otherWork.value;
  toStep5.disabled=!state.otherWork;
};

toStep5.onclick=()=>show("step5");

// ===== 送信 =====
document.getElementById("submitBtn").onclick=async()=>{
  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify(state)
  });

  show("done");
};
