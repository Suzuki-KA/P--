from fastapi import FastAPI
from pydantic import BaseModel
import json

class Answer(BaseModel):
    answer:list[int]

app=FastAPI()

with open("problem.json","r",encoding="utf-8") as f:
    problems=json.load(f)

@app.get("/")
def root():
    return{"message":"apiapiapi"}

#最初の説明
@app.get("/problem/{problem_number}/description")
def description_get(problem_number:int):
    for problem in problems:
        if problem["number"]==problem_number:
            return {"description_video_url":problem["description_video_url"]}

#問題出すとき
@app.get("/problem/{problem_number}/question")
def question_get(problem_number:int):
    for problem in problems:
        if problem["number"]==problem_number:
            return {
                "question":problem["question"],
                "options":problem["options"]
            }

#正誤判定
@app.post("/problem/{problem_number}/answer")
def answer_post(answer:Answer,problem_number:int):
    for problem in problems:
        if problem_number==problem["number"]:
            corect=(set(answer.answer)==set(problem["corect_answer"]))
            return {"corect":corect}
            
#解説
@app.get("/problem/{problem_number}/explanation")
def explanation_get(problem_number:int):
    for problem in problems:
        if problem["number"]==problem_number:
            return {"explanation":problem["explanation"]}
