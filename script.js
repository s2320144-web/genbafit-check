const LIFF_ID = "2009527083-GI7XhhzG";

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    console.log("ログイン成功");
  } catch (e) {
    alert("LIFF初期化エラー：" + e);
  }
}

window.onload = initLiff;
