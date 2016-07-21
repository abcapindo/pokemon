import requests
import os
import json
import sys

def printProgress (iteration, total, prefix = '', suffix = '', decimals = 2, barLength = 100):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : number of decimals in percent complete (Int)
        barLength   - Optional  : character length of bar (Int)
    """
    filledLength    = int(round(barLength * iteration / float(total)))
    percents        = round(100.00 * (iteration / float(total)), decimals)
    bar             = '#' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('%s [%s] %s%s %s\r' % (prefix, bar, percents, '%', suffix)),
    sys.stdout.flush()
    if iteration == total:
        print("\n")

def parseData (move) :
    filename = move['name'] + '.json'
    newJSON = {}

    # Parse data into new JSON, keeping only some of
    # the data and reparsing into a better format
    newJSON['name'] = move['name']
    newJSON['id'] = move['id']
    newJSON['pp'] = move['pp']
    newJSON['power'] = move['power']
    newJSON['damage_type'] = move['damage_class']['name']
    newJSON['accuracy'] = move['accuracy']

    newType = {}
    newType['name'] = move['type']['name']
    newStr = move['type']['url'].split('/type/')[1].split('/')
    newType['id'] = int(newStr[0])
    newJSON['type'] = newType

    newJSON['drain'] = move['meta']['drain']
    newJSON['healing'] = move['meta']['healing']
    newJSON['ailment_chance'] = move['meta']['ailment_chance']
    newJSON['flinch_chance'] = move['meta']['flinch_chance']
    newJSON['stat_chance'] = move['meta']['stat_chance']
    newJSON['crit_rate'] = move['meta']['crit_rate']

    newJSON['effect_chance'] = move['effect_chance']
    newDescription = move['effect_entries'][0]['effect']

    if ('$effect_chance%' in newDescription):
        newDescription = newDescription.replace('$effect_chance%', str(move['effect_chance']) + '%')
    newJSON['description'] = newDescription

def main():
    start = int(sys.argv[1])
    end = int(sys.argv[2])
    print("Starting Pulling of Data: Moves")

    s = 0
    l = (end - start)
    printProgress(s, l, prefix = 'Progress:', suffix = 'Complete', barLength = 50)
    for n in range(start, end):
        # API call for move
        r = requests.get('http://pokeapi.co/api/v2/move/' + str(n) + '/')
        move = r.json()

        parseData(move)

        s += 1
        printProgress(s, l, prefix = 'Progress:', suffix = 'Complete', barLength = 50)
        with open(filename, 'w') as outfile:
            outfile.write(json.dumps(newJSON, indent=4))

    print("Done.")

if __name__ == '__main__':
    main()
