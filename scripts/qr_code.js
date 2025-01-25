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

    } catch (ex) {
        console.error(ex);

        // window location
        window.location.href = LoginURL;
    }
}

// 初期化
Init();
