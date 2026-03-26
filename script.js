const LIFF_ID = "2009527083-MXJru0ta";
const GAS_URL = "https://script.google.com/macros/s/AKfycbxMlM_BEO9XzvRZDG7M8_uiqLiIgnCRiBID7AQGUcrrgL6zgSXKC7F8qzNDfV5b6a1ezw/exec";

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
  { value: 5, emoji: "😭", label: "かなり強い" }
];

function textValue(v, other) {
  return v === "その他" ? (other || "その他") : v;
}

function showStep(step) {
  state.step = step;
  ["step1", "step2", "step3", "step4", "step5", "done"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const targetId = step === 6 ? "done" : `step${step}`;
  const target = document.getElementById(targetId);
  if (target) target.classList.remove("hidden");
}

function updateStep1() {
  document.querySelectorAll("#partOptions .option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.part && !state.noPain);
  });

  const noPainBtn = document.getElementById("noPainBtn");
  if (noPainBtn) {
    noPainBtn.classList.toggle("selected", state.noPain);
  }

  const otherPartWrap = document.getElementById("otherPartWrap");
  if (otherPartWrap) {
    otherPartWrap.classList.toggle(
      "hidden",
      !(state.part === "その他" && !state.noPain)
    );
  }

  const toStep2 = document.getElementById("toStep2");
  if (toStep2) {
    toStep2
