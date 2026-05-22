from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import json

class Answer(BaseModel):
    answer:list[int]

app=FastAPI()

# jsonを読み込み、中のデータを読み取れるようにする
with open("data/problem.json","r",encoding="utf-8") as f:
    problems=json.load(f)

# app.py で読み込んだ problems をnumber キーを持つ要素だけに絞る
problems = [p for p in problems if isinstance(p, dict) and "number" in p]

# staticフォルダを公開することで中のcss、jsをhtmlが呼び出せるようにする
app.mount("/static", StaticFiles(directory="static"), name="static")

# HTML表示
@app.get("/", response_class=HTMLResponse)
def root():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        return f.read()

#最初の説明
@app.get("/problem/{problem_number}/description")
def description_get(problem_number:int):
    for problem in problems:
        if problem.get("number") == problem_number:
            return {"description_video_url":problem["description_video_url"]}

#問題出すとき
@app.get("/problem/{problem_number}/question")
def question_get(problem_number:int):
    for problem in problems:
        if problem.get("number") == problem_number:
            return {
                "question":problem["question"],
                "scenario":problem["scenario"],
                "options":problem["options"],
                "image":problem["question_image"]
            }

#正誤判定
@app.post("/problem/{problem_number}/answer")
def answer_post(answer:Answer,problem_number:int):
    for problem in problems:
        if problem_number == problem.get("number"):
            corect=(set(answer.answer)==set(problem["corect_answer"]))
            problem["explanation"]=problem[f"explanation{answer.answer[0]}"]
            return {"corect":corect}
        
            
#解説
@app.get("/problem/{problem_number}/explanation")
def explanation_get(problem_number:int):
    for problem in problems:
        if problem.get("number") == problem_number:
            return {"explanation":problem["explanation"]}
