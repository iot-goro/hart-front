// 会話終了ボタン
const end_talk_btn = document.getElementById("end-talk-button");

end_talk_btn.addEventListener("click", async function (evt) {
    try {
        // 会話終了
        await EndTalk();

        // リダイレクト
        window.location.href = TalkedURL;
    } catch (error) {
        console.error(error);
    }
});

async function EndTalk() {
    const authData = await GetSession();

    const req = await fetch("/app/matching/", {
        method: "DELETE",
        headers: {
            "Authorization": authData["token"],
        }
    });

    const result = await req.json();
    console.log(result);
}

var flag_speech = 0;

function vr_function() {
    // window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    // recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onsoundstart = function() {
        console.log("認識中");
    };
    recognition.onnomatch = function() {
        console.log("もう一度試してください");
    };
    recognition.onerror = function(evt) {
        console.log(evt.error);
        console.log("エラー");
        if(flag_speech == 0) {
            setTimeout(() => {
                vr_function();    
            }, 1000);
        }
    };
    recognition.onsoundend = function() {
        console.log("停止中");
          vr_function();
    };

    recognition.onresult = function(event) {
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; i++) {
            if (results[i].isFinal)
            {
                console.log(results[i][0].transcript);
                vr_function();
            }
            else
            {
                console.log("[途中経過] " + results[i][0].transcript);
                flag_speech = 1;
            }
        }
    }

    flag_speech = 0;
    console.log("start");
    recognition.start();
}

function StartSpeech() {
    // vr_function();
    console.log("音声認識を開始します");
}

const aitename = document.getElementById("name");

async function Init() {
    try {
        // ステータス取得
        const status = await GetStatus();

        // 話していないとき
        if (status["TalkStatus"] != "talking") {
            // リダイレクト
            window.location.href = HomeURL;
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
        window.location.href = LoginURL;
    }
}

Init();// 話題の中身
const talk_wrap = document.getElementById("talk_wrap");

// 過去の話した内容を表示する
document.addEventListener("DOMContentLoaded", () => {

    // 配列からサンプルデータを全件取得
    const dataItem = [
        {
            id: 0,
            date: "2022年12月21日",
            time: "20:00",
            talk_time: "30分",
            theme: "ねこ",
            memo: "ねこを見た",
        },
        {
            id: 1,
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
        {
            id: 2,
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
        {
            id: "aa",
            date: "2022年12月28日",
            time: "20:00",
            talk_time: "30分",
            theme: "いぬ",
            memo: "いぬを見た",
        },
    ];

    dataItem.forEach(item => {
        // talk_listの要素を作成
        const talk_list = document.createElement("div");
        talk_list.classList.add("talk_list");

        // time_wrapの要素を作成
        const time_wrap = document.createElement("div");
        time_wrap.classList.add("time_wrap");

        // 日付と時間を表示
        const date = document.createElement("p");
        date.classList.add("date");
        date.textContent = item.date;

        const time = document.createElement("p");
        time.classList.add("time");
        time.textContent = item.time;

        const talk_time = document.createElement("p");
        talk_time.classList.add("talk_time");
        talk_time.textContent = item.talk_time;

        // time_wrapに日付と時間を追加
        time_wrap.appendChild(date);
        time_wrap.appendChild(time);
        time_wrap.appendChild(talk_time);

        // memo_wrapの要素を作成
        const memo_wrap = document.createElement("div");
        memo_wrap.classList.add("memo_wrap");

        // 話題を表示
        const theme_wrap = document.createElement("div");
        theme_wrap.classList.add("theme_wrap");

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = "話題：";

        const theme_text = document.createElement("div");
        theme_text.classList.add("theme_text");

        const theme = document.createElement("p");
        theme.classList.add("theme");
        theme.textContent = item.theme;

        theme_text.appendChild(theme);
        theme_wrap.appendChild(title);
        theme_wrap.appendChild(theme_text);

        // メモを表示
        const memo = document.createElement("p");
        memo.classList.add("memo");
        memo.textContent = item.memo;

        memo_wrap.appendChild(theme_wrap);
        memo_wrap.appendChild(memo);

        // talk_listに要素を追加
        talk_list.appendChild(time_wrap);
        talk_list.appendChild(memo_wrap);

        // talk_wrapにtalk_listを追加
        talk_wrap.appendChild(talk_list);

        // クリックイベント
        talk_list.addEventListener("click", () => {
            console.log(`${item.id} がクリックされました`);
        });
    });

});
