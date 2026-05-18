function hideAllScreens() {

    document.getElementById("menu-screen")
        .classList.add("hidden");

    document.getElementById("study-screen")
        .classList.add("hidden");

    document.getElementById("quiz-screen")
        .classList.add("hidden");

    document.getElementById("explanation-screen")
        .classList.add("hidden");
}

function showMenuScreen() {

    hideAllScreens();

    document.getElementById("menu-screen")
        .classList.remove("hidden");
}

function showStudyScreen(videoData) {

    hideAllScreens();

    if (isAllowedVideoUrl(videoData)) {
        const iframe = document.getElementById("video-frame");
        iframe.src = videoData;
    } else {
        console.warn("無効な動画URLです:", videoData);
        alert("動画URLが無効です。安全なURLを使ってください。");
        return;
    }

    document.getElementById("study-screen")
        .classList.remove("hidden");
}

//url検査
function isAllowedVideoUrl(url) {
    if (typeof url !== "string" || !url.trim()) {
        return false;
    }

    try {
        const parsedUrl = new URL(url, window.location.origin);

        if (parsedUrl.protocol !== "https:") {
            return false;
        }

        const allowedHosts = [
            "drive.google.com",
        ];

        return allowedHosts.some(host =>
            parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
        );
    } catch (error) {
        return false;
    }
}


function showQuizScreen() {

    hideAllScreens();

    document.getElementById("quiz-screen")
        .classList.remove("hidden");
}

function showExplanationScreen() {

    hideAllScreens();

    document.getElementById("explanation-screen")
        .classList.remove("hidden");
}

// グローバル変数で現在の問題IDを保持
let currentProblemId = null;

//クイズ番号の指定と説明動画URLを取得
async function studyQuiz(quizId) {
    currentProblemId = quizId;

    try {
        const descriptionResponse = await fetch(`/problem/${quizId}/description`);
        if (!descriptionResponse.ok) throw new Error('説明動画の取得に失敗しました');
        //データ取得
        const descriptionData = await descriptionResponse.json();
        const videoUrl = typeof descriptionData === "string"
            ? descriptionData
            : descriptionData.description_video_url || "";
        //文字列はパースするとオブジェクトのためオブジェクトのキー値のみ抽出

        if (!videoUrl) throw new Error('説明動画URLが見つかりません');
        if (!isAllowedVideoUrl(videoUrl)) throw new Error('説明動画URLが安全ではありません');

        showStudyScreen(videoUrl);

    } catch (error) {
        console.error("通信エラー:", error);
        alert("データ取得に失敗しました");

    }
}

function answerQuestion(correct){

    if(correct){
        alert("〇 正解！");
    } else {
        alert("× 不正解");
    }

    showExplanationScreen();
}