from bs4 import BeautifulSoup
import requests
import os
import hashlib
import time
from pymongo import MongoClient

source='https://cronicabrasileira.org.br/cronicas'

contentPath = os.getenv("CONTENT_PATH")
mongouri = os.getenv("MONGO_URI")
dbname = os.getenv("DB_NAME")
tryGetDataXTimes = os.getenv("GET_DATA_X_TIMES")
if tryGetDataXTimes == None:
    tryGetDataXTimes = 10
else:
    tryGetDataXTimes = int(tryGetDataXTimes)
# print(soup.prettify())

def getContentString(content, className):
    return str(content.find(class_=className).string)

def getChapter(content, id):
    titleTag = content.find(class_="chronical-title")
    title = titleTag.string
    titleHash = hashlib.sha256(bytearray(title, 'utf-8')).hexdigest()
    url = titleTag['href']
    print("buscando capitulo para " + id)
    time.sleep(2)
    chptHtml = BeautifulSoup(requests.get(url).content, 'html.parser')
    filePath = os.path.join(id, titleHash)
    realPath = os.path.join(contentPath, filePath)
    if len([x for x in os.listdir(contentPath) if x.endswith(id)]) == 0:
        os.mkdir(os.path.join(contentPath, id))
    with open(realPath, 'w') as file:
        file.write(str(chptHtml.find(class_="chronical-item-text")))
    
    return {
            'title': title,
            'filePath': filePath,
            'size': os.path.getsize(realPath),
            'source': url
            }
worksAdded = 0
chaptersAdded = 0
worksSkipped = 0
print("conectado no banco de dados")
with MongoClient(mongouri) as conn:
    db= conn[dbname]
    ltWkCol = db['literaryWorks']
    # pegar a div onde tem os contos
    print("buscaremos contos " + str(tryGetDataXTimes) + "vezes")
    for _ in range(tryGetDataXTimes):
        time.sleep(1)
        print("buscando contos: " + str(_ + 1))
        html = requests.get(source)
        soup = BeautifulSoup(html.content, 'html.parser')
        listWorks = soup.find(attrs={"class": "shiro-content-items"})
        for content in listWorks.findAll(attrs={"class": "chronical"}):
            #print(content)
            #print("---")
            literaryWork = {
                    "title": getContentString(content,"chronical-title"),
                    "author": getContentString(content,"chronical-author"),
                    "type": "chronical",
                    "source": source,
                    "chapters": []
                    }
            if ltWkCol.count_documents({"title": {"$eq": literaryWork['title']}}) != 0:
                worksSkipped = worksSkipped + 1
                continue
            print("adicionando obra " + literaryWork['title'])
            result = ltWkCol.insert_one(literaryWork)
            if result.acknowledged:
                worksAdded = worksAdded + 1
                print("obra " + literaryWork['title'] + " adicionada, id: " + str(literaryWork['_id']))
                literaryWork['chapters'] = [getChapter(content, str(literaryWork['_id']))]
                updtRes = ltWkCol.update_one({'_id': literaryWork['_id']}, {'$set': {"chapters": literaryWork['chapters']}})
                chaptersAdded = chaptersAdded + 1
                print("Capitulo da obra " + str(literaryWork['_id']) + " adicionado") 

print("Obras ja presentes no banco de dados: " + str(worksSkipped))
print("Obras adicionadas: " + str(worksAdded))
print("Capitulos adicionados: " + str(chaptersAdded))
