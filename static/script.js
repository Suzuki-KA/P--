function hideAllScreens() {

    document.getElementById("top-screen")
        .classList.add("hidden");

    document.getElementById("menu-screen")
        .classList.add("hidden");

    document.getElementById("study-screen")
        .classList.add("hidden");

    document.getElementById("quiz-screen")
        .classList.add("hidden");
    document.getElementById("image-screen")
        .classList.add("hidden");

    document.getElementById("explanation-screen")
        .classList.add("hidden");
}

function showTopScreen() {

    hideAllScreens();

    document.getElementById("top-screen")
        .classList.remove("hidden");
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
    document.getElementById("image-screen")
        .classList.remove("hidden");

    // 問題文を画面に反映してから表示
    const h2quiz = document.getElementById("question-text");
    if (h2quiz) h2quiz.textContent = currentQuestion || "";

    const h2Scenario = document.getElementById("scenario-text");
    if (h2Scenario) h2Scenario.textContent = currentScenario || "";

    // const imageUrl = document.getElementById("image-url");
    // if (imageUrl) imageUrl.textContent = currentImageUrl || "";
    // console.log(imageUrl);
    // imageUrl.src = imageUrl;
    
    document.getElementById("image-url").src =
    `/static/quiz${currentProblemId}.png`;

    for (i = 1; i <= 4; i++) {
        const select = document.getElementById(`select${i}`);
        if (select) select.textContent = questionData.options[i - 1].option || "";
        console.log(select.textContent);
    }
    
}

function showExplanationScreen() {

    hideAllScreens();

    document.getElementById("explanation-screen")
        .classList.remove("hidden");

    const explanation = document.getElementById("explanation-text");
    if (explanation) explanation.textContent = currentExplanation || "";

}

// グローバル変数で現在の問題IDを保持
let currentProblemId = null;
let currentQuestion = null;
let questionData = null;
let currentExplanation = null;
let currentImageUrl =null;
let currentScenario = null;

//クイズ番号の指定と説明動画URLを取得
async function studyQuiz(quizId) {
    currentProblemId = quizId;

    try {
        const descriptionResponse = await fetch(`/problem/${quizId}/description`);
        if (!descriptionResponse.ok) throw new Error('説明動画の取得に失敗しました');
        //JSONデータ取得
        const descriptionData = await descriptionResponse.json();
        const videoUrl = typeof descriptionData === "string"
            ? descriptionData
            : descriptionData.description_video_url || "";
        //文字列はパースするとオブジェクトのためオブジェクトのキー値のみ抽出
        if (!videoUrl) throw new Error('説明動画URLが見つかりません');
        if (!isAllowedVideoUrl(videoUrl)) throw new Error('説明動画URLが安全ではありません');
        showStudyScreen(videoUrl);

        const questionResponse = await fetch(`/problem/${quizId}/question`);
        if (!questionResponse.ok) throw new Error('問題の取得に失敗しました');
        questionData = await questionResponse.json();
        const question = typeof questionData === "string"
            ? questionData
            : questionData.question || "";

        currentQuestion = question;

        const scenario = typeof questionData === "string"
            ? questionData
            : questionData.scenario || "";

        currentScenario = scenario;

        const image = typeof questionData === "string"
            ? questionData
            : questionData.image || "";
        currentImageUrl = image;

        const explanationResponse = await fetch(`/problem/${quizId}/explanation`);
        if (!explanationResponse.ok) throw new Error('問題の取得に失敗しました');
        explanationData = await explanationResponse.json();
        const explanation = typeof explanationData === "string"
            ? explanationData
            : explanationData.explanation || "";

        currentExplanation = explanation;



    } catch (error) {
        console.error("通信エラー:", error);
        alert("データ取得に失敗しました");

    }
}

function answerQuestion(answerId) {
    //nextStep();
    const data = {
        answer: [answerId]
    };
    fetch(`../problem/${currentProblemId}/answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result.corect);
            if (result.corect === true) {
                alert("〇 正解！");
            } else {
                alert("× 不正解");
            }
            // 解説を再取得
            const explanationResponse =
                await fetch(`/problem/${currentProblemId}/explanation`);
                if (!explanationResponse.ok) throw new Error('問題の取得に失敗しました');

            const explanationData =
                await explanationResponse.json();
            const explanation = typeof explanationData === "string"
                    ? explanationData
                    : explanationData.explanation || "";
            currentExplanation = explanationData.explanation;
            showExplanationScreen();
        });



    
}