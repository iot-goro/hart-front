async function GetToken() {
    // トークンを取得
    const authData = await GetSession();

    const req = await fetch("/app/matching/",{
        method:"GET",
        headers : {
            "Authorization" : authData["token"],
        }
    })

    const result = await req.json();
    return result["token"];
}

async function Init() {
    // ローディング表示
    showLoading();

    // テキスト設定 
    setLoadText("読み込み中");

    try {
        // 認証情報取得
        const authData = await GetSession();

        console.log(authData);
        const token = await GetToken();

        var qrcode = new QRCode("qr_code_wrap", {
            text: token,
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        console.log("トークンだよ: " + token);

        setInterval(async () => {
            const status = await GetStatus();

            // 話しているとき
            if (status["TalkStatus"] == "talking") {
                // リダイレクト
                window.location.href = TalkingURL;
            };
        }, 1000);

        // ローディング解除
        hideLoading();

    } catch (ex) {
        console.error(ex);

        // window location
        window.location.href = LoginURL;
    }
}

// 初期化
Init();
