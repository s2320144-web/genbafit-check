document.addEventListener("DOMContentLoaded", () => {
  const noPainBtn = document.getElementById("noPainBtn");
  const partButtons = [...document.querySelectorAll("#partOptions .option-btn")];
  const toStep2 = document.getElementById("toStep2");
  const otherPartWrap = document.getElementById("otherPartWrap");
  const otherPartInput = document.getElementById("otherPart");

  function clearSelected() {
    noPainBtn.classList.remove("selected");
    partButtons.forEach((b) => b.classList.remove("selected"));
  }

  noPainBtn.addEventListener("click", () => {
    clearSelected();
    noPainBtn.classList.add("selected");
    otherPartWrap.classList.add("hidden");
    toStep2.disabled = false;
    console.log("特にない クリック");
  });

  partButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearSelected();
      btn.classList.add("selected");

      if (btn.dataset.value === "その他") {
        otherPartWrap.classList.remove("hidden");
        toStep2.disabled = otherPartInput.value.trim() === "";
      } else {
        otherPartWrap.classList.add("hidden");
        toStep2.disabled = false;
      }

      console.log("部位クリック:", btn.dataset.value);
    });
  });

  otherPartInput.addEventListener("input", () => {
    if (!otherPartWrap.classList.contains("hidden")) {
      toStep2.disabled = otherPartInput.value.trim() === "";
    }
  });
});
