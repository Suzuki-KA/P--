function hideAllScreens(){

    document.getElementById("menu-screen")
        .classList.add("hidden");

    document.getElementById("study-screen")
        .classList.add("hidden");

    document.getElementById("quiz-screen")
        .classList.add("hidden");

    document.getElementById("explanation-screen")
        .classList.add("hidden");
}

function showMenuScreen(){

    hideAllScreens();

    document.getElementById("menu-screen")
        .classList.remove("hidden");
}

function showStudyScreen(){

    hideAllScreens();

    document.getElementById("study-screen")
        .classList.remove("hidden");
}

function showQuizScreen(){

    hideAllScreens();

    document.getElementById("quiz-screen")
        .classList.remove("hidden");
}

function showExplanationScreen(){

    hideAllScreens();

    document.getElementById("explanation-screen")
        .classList.remove("hidden");
}


function answerQuestion(correct){

    if(correct){
        alert("〇 正解！");
    } else {
        alert("× 不正解");
    }

    showExplanationScreen();
}
