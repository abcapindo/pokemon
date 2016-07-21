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

def main():
    start = int(sys.argv[1])
    end = int(sys.argv[2])
    print("Starting Pulling of Data")

    s = 0
    l = (end - start)
    printProgress(s, l, prefix = 'Progress:', suffix = 'Complete', barLength = 50)
    for n in range(start, end):
        r = requests.get('http://pokeapi.co/api/v2/pokemon/' + str(n) + '/')
        pokemon = r.json()
        filename = pokemon['name'] + '.json'
        newJSON = {}
        for i in pokemon:
            if i == 'forms':
                pass
            elif i == 'game_indices':
                pass
            elif i == 'location_area_encounters':
                pass
            elif i == 'species':
                pass
            elif i == 'is_default':
                pass
            elif i == 'height':
                pass
            elif i == 'weight':
                pass
            elif i == 'base_experience':
                pass
            elif i == 'order':
                pass
            else:
                if i == 'abilities':
                    newJSON['abilities'] = []
                    for j in pokemon[i]:
                        newAbility = {}
                        newAbility['name'] = j['ability']['name']
                        newStr = j['ability']['url'].split('/ability/')[1].split('/')
                        newAbility['id'] = int(newStr[0])

                        newJSON['abilities'].append(newAbility)
                elif i == 'moves':
                    newJSON['moves'] = []
                    for j in pokemon[i]:
                        newMove = {}
                        newMove['name'] = j['move']['name']
                        newStr = j['move']['url']
                        newStr = newStr.split('move/')[1].split('/')
                        newMove['id'] = int(newStr[0])
                        newMove['level'] = j['version_group_details'][0]['level_learned_at']
                        newMove['method_learned'] = j['version_group_details'][0]['move_learn_method']['name']
                        newJSON['moves'].append(newMove)
                elif i == 'stats':
                    newJSON['stats'] = []
                    for j in pokemon[i]:
                        newStat = {}
                        newStat['name'] = j['stat']['name']
                        newStat['stat'] = j['base_stat']
                        newStr = j['stat']['url'].split('/stat/')[1].split('/')
                        newStat['id'] = int(newStr[0])
                        newJSON['stats'].append(newStat)
                elif i == 'types':
                    newJSON['types'] = []
                    for j in pokemon[i]:
                        newStat = {}
                        newStat['name'] = j['type']['name']
                        newStr = j['type']['url'].split('/type/')[1].split('/')
                        newStat['id'] = int(newStr[0])
                        newJSON['types'].append(newStat)
                else:
                    newJSON[i] = pokemon[i]
        s += 1
        printProgress(s, l, prefix = 'Progress:', suffix = 'Complete', barLength = 50)
        with open(filename, 'w') as outfile:
            outfile.write(json.dumps(newJSON, indent=4))

    print("Done.")

if __name__ == '__main__':
    main()
