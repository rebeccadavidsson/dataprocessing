"""
Name: Rebecca Davidsson
Student number: 11252138
convertCSVJSON.py:
Converts two csv files and merges the files into one dictionary.
Input csv files include data per day (starting from day 1).
The dictionary is converted into one json file.
"""

import csv
import json

# Read the csv file
dates = []
sun = []
sun2 = []
counter = 1
input_first_file = 'sun.csv'
input_second_file = 'sun2.csv'

with open(input_first_file, 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        dates.append(counter)
        sun.append(int(row[2].strip(" ")))
        counter += 1

with open(input_second_file, 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        sun2.append(int(row[2].strip(" ")))

# Make a dictionary of the data
dict = {}
for i in range(len(sun)):
    print({dates[i]: {"oktober": sun[i], "november": sun2[i]}})
    dict.update({dates[i]: {"oktober": sun[i], "november": sun2[i]}})

# Put the dictionary into a json file
with open('data.json', 'w') as outfile:
    json.dump(dict, outfile)
