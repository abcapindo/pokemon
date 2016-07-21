import os
import json
from elasticsearch import Elasticsearch

def main():
    es = Elasticsearch()
    print("Placing Data into elasticseach")

    dataId = 1
    for f in os.listdir("."):
        if ".json" in f:
            with open(f, 'r') as data_file:
                data = json.load(data_file)
                res = es.index(index="data", doc_type='pokemon', id=dataId, body=data)
                dataId += 1
                if res['created'] == False:
                    print("Did not finish correctly: index:data dumped")
                    es.delete(index='data')
                    break
                print(f + " " + res['created'])
        print("Done.")

if __name__ == '__main__':
    main()
