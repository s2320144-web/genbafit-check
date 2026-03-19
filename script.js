const LIFF_ID = "2009527083-GI7XhhzG";

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    // 未ログインならログイン
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    document.getElementById("status").innerText = "ログイン成功";

  } catch (e) {
    alert("LIFF初期化エラー: " + JSON.stringify(e));
  }
}

window.onload = initLiff;
