import csv
import json

# Read the csv file
dates = []
sun = []
with open('sun.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        dates.append(row[1])
        sun.append(int(row[2].strip(" ")))

# Make a dictionary of the data
dict = {}
for i in range(len(dates)):
    dict.update({dates[i]: sun[i]})

# Put the dictionary into a json file
with open('sun.json', 'w') as outfile:
    json.dump(dict, outfile)
