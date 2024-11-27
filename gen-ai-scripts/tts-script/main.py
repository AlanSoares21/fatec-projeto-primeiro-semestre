import time
import torch
from TTS.api import TTS
import pymongo as mg
import os
import pika as pk
from bson import ObjectId

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

class RbHandler():
    tts_queue = 'TTS'
    tts_completed = 'TTS_COMPLETED'
    _conn: pk.BlockingConnection
    _channel= None

    def __init__(self) -> None:
        rbmq_host = os.getenv("RBMQ_HOST")
        rbmq_port = os.getenv("RBMQ_PORT")
        rbmq_user = os.getenv("RBMQ_USER")
        rbmq_pwd = os.getenv("RBMQ_PASSWORD")
        
        timeout = 5 * 60
        timeoutStr = os.getenv("RBMQ_TIMEOUT")
        if timeoutStr is not None and len(timeoutStr) > 0:
            timeout = int(timeoutStr)
        
        print('connecting to RabbitMQ in the host {}:{}'.format(rbmq_host, rbmq_port))
        self._conn = pk.BlockingConnection(pk.ConnectionParameters(
            host= rbmq_host,
            port= rbmq_port, 
            credentials= pk.PlainCredentials(rbmq_user, rbmq_pwd),
            blocked_connection_timeout= timeout,
            socket_timeout= timeout,
            heartbeat= timeout))
        self._channel = self._conn.channel()
    
    def work_to_handle(self):
        self._channel.queue_declare(
            queue= self.tts_queue, 
            exclusive= False, 
            auto_delete= False)
        result = self._channel.basic_get(self.tts_queue, auto_ack= False)
        print('result: {}'.format(result))
        if result[2] is None:
            return (None, None)
        return (result[0].delivery_tag, result[2].decode('ascii'))

    def requeue(self, delivery):
        self._channel.queue_declare(
            queue= self.tts_queue, 
            exclusive= False, 
            auto_delete= False)
        self._channel.basic_nack(delivery, multiple= False, requeue= True)

    def dequeue(self, delivery):
        self._channel.queue_declare(
            queue= self.tts_queue, 
            exclusive= False, 
            auto_delete= False)
        self._channel.basic_ack(delivery, multiple= False)

    def completed(self, workid: str):
        self._channel.queue_declare(
            queue= self.tts_completed, 
            exclusive= False, 
            auto_delete= False)
        self._channel.basic_publish(
            exchange= '',
            routing_key= self.tts_completed,
            body= workid)
        print('request for work {} added in the completed queue'.format(workid))

    def close(self):
        self._channel.close()
        self._conn.close()
        print('connection to RabbitMQ closed')

class MgHandler():
    conn: mg.MongoClient
    db= None
    ltWk= None
    
    def __init__(self) -> None:
        mongouri = os.getenv("MONGO_URI")
        dbname = os.getenv("DB_NAME")
        self.conn = mg.MongoClient(mongouri)
        self.db = self.conn[dbname]
        self.ltWk = self.db['literaryWorks']

    def get_work(self, id):
        print('searching work {}'.format(id))
        res = self.ltWk.find({"_id": ObjectId(id)}).limit(1).to_list()
        if len(res) == 0:
            return None
        return res[0]

    def close(self):
        self.conn.close()
    
    def saveAudioContent(self, work, path):
        work['chapters'][0]['mp3'] = path
        self.ltWk.update_one({'_id': work['_id']}, {'$set': {"chapters": work['chapters']}})
        print('audio {} saved to work {}'.format(path, work))


def readContent(path):
    print('reading content of {}'.format(path))
    content= ''
    with open(path, 'r') as file:
        content = removeHtmlElements(str.join('.', file.readlines()))
    print('content len: ' + str(len(content)))
    return content

def make_audio_content(content, output_path):
    try:
        if os.path.exists(output_file_path):
            print('file at {} already exists, removing it'.format(output_path))
            os.remove(output_file_path)
        model = 'tts_models/pt/cv/vits'
        print('checking if cuda is avaliable')
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print('loading model')
        tts = TTS(model).to(device)

        print('running tts. device: {}'.format(device))
        # Text to speech to a file
        tts.tts_to_file(
            text=content, 
            speaker_wav="./audio/base-audio.wav", 
            file_path=output_path)
        return True
    except Exception as ex:
        print('Error when creating audio: {}'.format(ex))
        return False
        


interval = 60
intervalStr = os.getenv('TTS_WORKER_INTERVAL_IN_SECONDS')
if intervalStr is not None and len(intervalStr) > 0:
    interval = int(intervalStr)

while True:
    print('sleeping for {} seconds'.format(interval))
    time.sleep(interval)
    rb = RbHandler()
    mc = MgHandler()
    try:
        while True:
            (delivery, workid) = rb.work_to_handle()
            if delivery is None:
                print('devilery is none, no requests to handle')
                break
            if workid is not None:
                contentPath = os.getenv("CONTENT_PATH")
                work = mc.get_work(workid)
                print('tts for the work: {}'.format(work))
                chapter = work['chapters'][0]
                filePath = work['chapters'][0]['filePath']
                filePath_splited = work['chapters'][0]['filePath'].split('/')
                content_folder_name = filePath_splited[0]
                output_file_path = os.path.join(content_folder_name, filePath_splited[1] + '.mp3')
                real_file_path = os.path.join(contentPath, filePath)
                real_output_file_path = os.path.join(contentPath, output_file_path)
                print('output file: {}'.format(output_file_path))
                success = make_audio_content(readContent(real_file_path), real_output_file_path)
                if success:
                    print('content to work {} created in {}'.format(workid, output_file_path))
                    mc.saveAudioContent(work, output_file_path)
                    print('removing request from the requests queue')
                    rb.dequeue(delivery)
                    print('adding request in the completed queue')
                    rb.completed(workid)
                    continue
                else:
                    print('fail on creating content to work {} in {}'.format(workid, output_file_path))
            rb.requeue(delivery)
    except Exception as ex:
        print('Error in the main loop. {}'.format(ex))
    finally:
        mc.close()
        rb.close()