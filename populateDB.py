import json
import sqlite3
from pprint import pprint


JSON_FILE = "./cities.json"
DB_FILE = "./data.sqlite"

traffic = json.load(open(JSON_FILE))
connection = sqlite3.connect(DB_FILE)

print(traffic)

data = []

for i in traffic:
    item = {}
    item['id'] = str(i['id'])
    item['name'] = i['name']
    item['walkability'] = str(i['scores']['walkability'])
    item['job_growth'] = str(i['scores']['job_growth'])
    item['green_space'] = str(i['scores']['green_space'])
    item['taxes'] = str(i['scores']['taxes'])
    data.append(item)

pprint(data)

c = connection.cursor()
c.execute('create table data (id, name, walkability, job_growth, green_space, taxes)')
for i in data:
    c.execute(
        'insert into data (id, name, walkability, job_growth, green_space, taxes) values (' + i['id'] + ',\'' + i['name'] + '\',' + i['walkability'] + ',' + i['job_growth'] + ',' + i['green_space'] + ',' + i['taxes']+');')

connection.commit()
c.close()


                            
