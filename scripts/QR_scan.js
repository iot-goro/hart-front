const token_Input = document.getElementById("token_Input");
const token_submit = document.getElementById("token_submit");

token_submit.addEventListener("click",async function (evt) {
    const token = token_Input.value;

    console.log(token);

    await Matching(token);

    // ローカルストレージのデータ削除
    window.localStorage.removeItem("talk_memo");

    // リダイレクト
    window.location.href = TalkingURL;
});

async function Matching(token) {
    const authData = await GetSession();

    const req = await fetch("/app/matching/",{
        method:"POST",
        headers : {
            "Authorization" : authData["token"],
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "token" : token
        })
    });

    const result = await req.json();
    console.log(result);
}


async function Init() {
    try {
        const status = await GetStatus();

        // 話しているとき
        if (status["TalkStatus"] == "talking") {
            // リダイレクト
            window.location.href = TalkingURL;
        };

        
    } catch (ex) {
        // エラー処理
        console.error(ex);
        // alert("読み取りに失敗しました");

        // ログインに飛ばす
        // window.location.href = LoginURL;
    }
}

Init();