const token_Input = document.getElementById("token_Input");
const token_submit = document.getElementById("token_submit");

token_submit.addEventListener("click",async function (evt) {
    const token = token_Input.value;

    console.log(token);

    await Matching(token);
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

async function GetStatus() {
    const authData = await GetSession();

    const req = await fetch("/app/status/",{
        method:"GET",
        headers : {
            "Authorization" : authData["token"],
        }
    });

    const result = await req.json();
    return result["status"];
}

async function Init() {
    const status = await GetStatus();

    if (status["TalkStatus"] == "talking") {
        
    };
}

Init();