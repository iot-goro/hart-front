const icon = document.getElementById("icon");
const name = document.getElementById("name");

// 話せる話題入力エリア
const hobby_textarea = document.getElementById("hobby_textarea");

// 最近困ってること入力エリア
const recent_textarea = document.getElementById("recent_textarea");

async function SaveHobby(text) {
    // 認証情報取得
    const authData = await GetSession();

    const req = await fetch("/app/profile/hobby",{
        method:"POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization" : authData["token"],
        },
        body: JSON.stringify({
            "hobby": text
        })
    });

    console.log(await req.json());
}

async function SaveRecent(text) {
    // 認証情報取得
    const authData = await GetSession();

    const req = await fetch("/app/profile/recent",{
        method:"POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization" : authData["token"],
        },
        body: JSON.stringify({
            "recent": text
        })
    });

    console.log(await req.json());
}

async function GetHobby() {
    const authData = await GetSession();

    const req = await fetch("/app/profile/hobby",{
        method:"GET",
        headers : {
            "Authorization" : authData["token"],
        }
    });

    const result = await req.json();
    return result["hobby"];
}

async function GetRecent() {
    const authData = await GetSession();

    const req = await fetch("/app/profile/recent",{
        method:"GET",
        headers : {
            "Authorization" : authData["token"],
        }
    });

    const result = await req.json();
    return result["recent"];
}

// 保存ボタン
const save_btn = document.getElementById("save_btn");

save_btn.addEventListener("click", async function (evt) {
    try {
        // 話せる話題と最近困ってることを保存する
        await SaveHobby(hobby_textarea.value);
        await SaveRecent(recent_textarea.value);
    } catch (ex) {
        console.error(ex);
    }
});

async function Init() {
    try {
        // 認証情報取得
        const authData = await GetSession();

        // 名前とアイコンを設定する
        icon.src = GetIcon(authData["record"]["id"]);
        name.textContent = authData["record"]["name"];

        // プロファイル取得
        hobby_textarea.value = await GetHobby();
        recent_textarea.value = await GetRecent();
    } catch (ex) {
        console.error(ex);
    }
}

// 初期化
Init();