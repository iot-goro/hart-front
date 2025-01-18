const aitename = document.getElementById("name");

async function Init() {
    try {
        // ステータス取得
        const status = await GetStatus();

        // 話していないとき
        if (status["TalkStatus"] == "talking") {
            // リダイレクト
            window.location.href = TalkingURL;
            return;
        };

        // 相手ユーザーの情報を取得する
        const uinfo = await GetUserInfo(status["TalkingToID"]);
        aitename.textContent = uinfo["UserName"];

        console.log("話しています");
    } catch (error) {
        console.error(error);
        alert("読み取りに失敗しました");

        // ログインに飛ばす
        // window.location.href = LoginURL;
    }
}

Init();