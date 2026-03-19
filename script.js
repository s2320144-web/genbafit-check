const LIFF_ID = "2009527083-Gl7XhhzG;

async function initLiff() {
  try {
    if (typeof liff === "undefined") {
      alert("LIFF SDK未読込: index.html の <head> に SDK script がありません");
      return;
    }

    await liff.init({ liffId: LIFF_ID });

    alert(
      "LIFF init success\n" +
      "currentUrl: " + location.href + "\n" +
      "inClient: " + liff.isInClient() + "\n" +
      "loggedIn: " + liff.isLoggedIn()
    );
  } catch (error) {
    const code = error?.code || "no_code";
    const message = error?.message || String(error);

    alert(
      "LIFF初期化エラー\n" +
      "code: " + code + "\n" +
      "message: " + message + "\n" +
      "currentUrl: " + location.href
    );

    console.error("LIFF init error detail:", error);
  }
}

window.onload = initLiff;
