import os
import openai
from pdfminer.high_level import extract_text
from dotenv import load_dotenv

#user posts question -> syllabus turned into text -> feed syllabus to chatbot -> if chatbot can answer -> update database, (comment) under the post


# load values from the .env file if it exists
load_dotenv()

# configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

INSTRUCTIONS = """You are an AI assistant who is an expert in the course syllabus.
You can provide information on the class.
If you're unable to provide the answer to a question, please respond with the phrase "I do not think that is on the syllabus."
Do not use any external URLs in your answer. Do not refer to any blogs in your answer."""


TEMPERATURE = 0.5
MAX_TOKENS = 500
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6



def get_response(prompt):
    """
    Get a response from the model using the prompt

    Parameters:
        prompt (str): The prompt to use to generate the response

    Returns the response from the model
    """
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )
    return response.choices[0].text


def ask_question(question, classID):
    #os.system("cls" if os.name == "nt" else "clear")

    #pdf will be taken from the tags -> see post class (tag?) -> pull syllabus from there
    syllabus = str(classID) + ".pdf"
    try:
        syllabusText = extract_text(syllabus)
        new_question = "given this text: " + syllabusText + "\n " + question + " ?"
        response = get_response(INSTRUCTIONS + new_question)
        response = response.lstrip()
        if response == "I do not think that is on the syllabus.":
            return "error"
        else:
            return response
    except FileNotFoundError:
        print("fail")
    else:
        pass
    return "error"

