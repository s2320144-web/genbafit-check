const LIFF_ID = "2009527083-MXJru0ta";

async function initLiff() {
  const statusEl = document.getElementById("status");

  try {
    if (typeof liff === "undefined") {
      statusEl.className = "status ng";
      statusEl.textContent = "LIFF SDKが読み込まれていません";
      return;
    }

    await liff.init({ liffId: LIFF_ID });

    statusEl.className = "status ok";
    statusEl.textContent =
      "LIFF init success\n" +
      "LIFF ID: " + LIFF_ID + "\n" +
      "URL: " + location.href + "\n" +
      "isInClient: " + liff.isInClient() + "\n" +
      "isLoggedIn: " + liff.isLoggedIn();

  } catch (error) {
    const code = error?.code || "no_code";
    const message = error?.message || String(error);

    statusEl.className = "status ng";
    statusEl.textContent =
      "LIFF初期化エラー\n" +
      "code: " + code + "\n" +
      "message: " + message + "\n" +
      "LIFF ID: " + LIFF_ID + "\n" +
      "URL: " + location.href;
  }
}

window.onload = initLiff;
