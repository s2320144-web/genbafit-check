document.getElementById("submitBtn").addEventListener("click", async () => {
  const partText = state.noPain ? "特にない" : textValue(state.part, state.otherPart);
  const scoreText = state.noPain ? "なし" : `${state.score}/5`;
  const trendText = state.trend || "未入力";
  const teamText = state.team || "未入力";
  const workText = textValue(state.work, state.otherWork);
  const memoText = state.memo || "なし";

  const resultMessage =
`【現場fit チェック】
部位：${partText}
痛み：${scoreText}
前週比：${trendText}
班・工区：${teamText}
作業：${workText}
補足：${memoText}`;

  try {
    if (typeof liff === "undefined") {
      alert("LIFFが読み込まれていません");
      return;
    }

    if (!liff.isInClient()) {
      alert("LINEアプリ内で開いてください");
      return;
    }

    if (!liff.isLoggedIn()) {
      alert("LINEからもう一度開き直してください");
      return;
    }

    const profile = await liff.getProfile();

    await liff.sendMessages([
      {
        type: "text",
        text: resultMessage
      }
    ]);

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        name: profile.displayName || "",
        userId: profile.userId || "",
        part: partText,
        score: scoreText,
        trend: trendText,
        team: teamText,
        work: workText,
        memo: memoText
      })
    });

    const text = await res.text();
    console.log("GAS response:", text);

    document.getElementById("doneMessage").textContent =
      !state.noPain && (state.score >= 4 || state.trend === "悪くなった")
        ? "入力ありがとうございました。負担が強い可能性があります。必要に応じて早めの相談を検討してください。"
        : "入力ありがとうございました。内容は現場改善と再発防止に活用されます。";

    document.getElementById("doneSummary").innerHTML =
      `部位：${partText}<br>
       痛み：${scoreText}<br>
       前週比：${trendText}<br>
       班・工区：${teamText}<br>
       作業：${workText}<br>
       補足：${memoText}`;

    showStep(6);
  } catch (error) {
    console.error("送信エラー:", error);
    alert("送信に失敗しました: " + (error.message || JSON.stringify(error)));
  }
});
