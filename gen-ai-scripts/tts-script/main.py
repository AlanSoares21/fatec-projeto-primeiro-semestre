import torch
from TTS.api import TTS
import pymongo as mg
import os
import pika as pk

contentPath = os.getenv("CONTENT_PATH")
mongouri = os.getenv("MONGO_URI")
dbname = os.getenv("DB_NAME")

def removeHtmlElements(value: str):
    newValue = ''
    copy = True
    for i in range(len(value)):
        if value[i] == '<':
            copy = False
        if copy:
            newValue = newValue + value[i]
        elif value[i] == '>':
            copy = True
    return newValue

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

model = 'tts_models/pt/cv/vits'
content = ''

with mg.MongoClient(mongouri) as conn:
    db = conn[dbname]
    ltWk = db['literaryWorks']
    print('searching work')
    work = ltWk.find({"chapters": {"$elemMatch": {"size": {"$gt": 4}}}}).limit(1).to_list()[0]
    print(work)
    work_content_folder = os.path.join(contentPath, work['chapters'][0]['filePath'].split('/')[0])
    output_file_path = os.path.join(work_content_folder, work['chapters'][0]['filePath'].split('/')[1] + '.mp3')
    content_file_path = os.path.join(contentPath, work['chapters'][0]['filePath'])
    print(work_content_folder)
    print(output_file_path)
    print(content_file_path)
    print('reading content')
    with open(content_file_path, 'r') as file:
        content = removeHtmlElements(str.join('.', file.readlines()))
    print('content len: ' + str(len(content)))

    print('starting ai model')
        # Init TTS
    tts = TTS(model).to(device)

    print('running tts')
    # Text to speech to a file
    tts.tts_to_file(
        text=content, 
        speaker_wav="./audio/base-audio.wav", 
        file_path=output_file_path)


