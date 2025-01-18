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

Init();