// 自分との関係
const relation_textarea = document.getElementById("relation_textarea");

// 保存ボタン
const relation_save = document.getElementById("relation_save");

relation_save.addEventListener("click", async function (evt) {
    // 自分との関係を保存する
    console.log(await SaveRelation());
});

async function SaveRelation() {
    const authData = await GetSession();
    const uid = new URLSearchParams(window.location.search).get("uid");

    const req = await fetch("/app/relationship/" + uid, {
        method: "POST",
        headers: {
            "Authorization": authData["token"],
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "relationDescription": relation_textarea.value
        })
    });

    const result = await req.json();
    return result;
}


async function ShowTalks() {
    const uid = new URLSearchParams(window.location.search).get("uid");
    // 会話を取得する
    const talks = await GetTalks(uid);

    talks.forEach(talk => {
        const talkDate = new Date(talk["CreatedAt"] * 1000);

        const date = talkDate.getFullYear() + "年" + (talkDate.getMonth() + 1) + "月" + talkDate.getDate() + "日";
        const time = talkDate.getHours() + ":" + (talkDate.getMinutes() < 10 ? "0" + talkDate.getMinutes() : talkDate.getMinutes());

        let topic = "";
        for (let i = 0; i < talk["Tags"].length; i++) {
            const tag = talk["Tags"][i];
            topic += tag + " ";
        }

        //         const talkHtml = `
        // <div class="talk_list">
        //     <div class="time_wrap">
        //         <!-- 話した日付 -->
        //         <p class="date">${date}</p>
        //         <p class="time">${time}</p>
        //     </div>
        //     <div class="memo_wrap">
        //         <!-- 話題 -->
        //         <div class="theme_wrap">
        //             <p class="title">話題：</p>
        //             <div class="theme_text">
        //                 <p class="theme">${topic}</p>
        //             </div>
        //         </div>
        //         <!-- 話した内容 -->
        //         <p class="memo">
        //             ${talk["Text"]}
        //         </p>
        //     </div>
        // </div>
        // `
        //         document.getElementById("talk_wrap").innerHTML += talkHtml;
        const talkList = document.createElement("div");
        talkList.className = "talk_list";

        const timeWrap = document.createElement("div");
        timeWrap.className = "time_wrap";

        // 日付と時間を追加
        const dateElement = document.createElement("p");
        dateElement.className = "date";
        dateElement.textContent = date; // XSS対策

        const timeElement = document.createElement("p");
        timeElement.className = "time";
        timeElement.textContent = time; // XSS対策

        timeWrap.appendChild(dateElement);
        timeWrap.appendChild(timeElement);

        const memoWrap = document.createElement("div");
        memoWrap.className = "memo_wrap";

        // 話題を追加
        const themeWrap = document.createElement("div");
        themeWrap.className = "theme_wrap";

        const titleElement = document.createElement("p");
        titleElement.className = "title";
        titleElement.textContent = "話題："; // XSS対策

        const themeText = document.createElement("div");
        themeText.className = "theme_text";

        const topicElement = document.createElement("p");
        topicElement.className = "theme";
        topicElement.textContent = topic; // XSS対策

        themeText.appendChild(topicElement);
        themeWrap.appendChild(titleElement);
        themeWrap.appendChild(themeText);

        memoWrap.appendChild(themeWrap);

        // 話した内容を追加
        const memoElement = document.createElement("p");
        memoElement.className = "memo";
        memoElement.textContent = talk["Text"]; // XSS対策

        memoWrap.appendChild(memoElement);

        // talkListにtimeWrapとmemoWrapを追加
        talkList.appendChild(timeWrap);
        talkList.appendChild(memoWrap);

        // talk_wrapに追加
        document.getElementById("talk_wrap").appendChild(talkList);

    });
}


const name = document.getElementById("name");

async function Init() {
    try {
        // ローディング表示
        showLoading();

        // ロード中のテキストを設定
        setLoadText("読み込み中");

        // 相手のIDを取得する
        const uid = new URLSearchParams(window.location.search).get("uid");

        // 認証情報取得
        const authData = await GetSession();

        // ユーザーの情報を取得
        const user = await GetUserInfo(uid);

        // 名前とアイコンを設定する
        icon.src = GetIcon(uid);
        name.textContent = user["UserName"];

        try {
            // 自分との関係を取得する
            const result = await GetRelation(uid);
            relation_textarea.value = result["relation"]["relationDescription"];
        } catch (error) {
            console.error(error);
        }

        try {
            // 会話を表示する
            await ShowTalks();
        } catch (error) {
            console.error(error);
        }
        // ロード完了
        hideLoading();
    } catch (ex) {
        console.error(ex);

        // window location
        window.location.href = LoginURL;
    }
}

Init();