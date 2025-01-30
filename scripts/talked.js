const aitename = document.getElementById("name");

const talk_memo = document.getElementById("talk_memo");


// 登録ボタン
const register_button = document.getElementById("register-button");

register_button.addEventListener("click", async function (evt) {
    try {
        // 登録
        await Register();

        // ローカルストレージの会話を削除
        window.localStorage.removeItem("talk_memo");

        // リダイレクト
        window.location.href = HomeURL;
    } catch (error) {
        console.error(error);
    }
});

// 登録
async function Register() {
    console.log(talk_memo.textContent);
    console.log(InputValues);

    const authData = await GetSession();

    // 登録実行
    const req = await fetch("/app/talk",{
        method:"POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization" : authData["token"],
        },
        body: JSON.stringify({
            "text": talk_memo.textContent,
            "tags": InputValues
        })
    });

    const result = await req.json();
    console.log(result);
}

// 初期化
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
        console.log(InputValues);

        const total_result = window.localStorage.getItem("talk_memo");
        talk_memo.textContent = total_result;
    } catch (error) {
        console.error(error);
        // alert("読み取りに失敗しました");

        // ログインに飛ばす
        window.location.href = LoginURL;
    }
}

Init();