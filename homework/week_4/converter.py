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
import pandas as pd

inputfile = 'data.csv'

df = pd.read_csv(inputfile)
# df = df.set_index('LOCATION')

# dict = {}
# for i in range(len(df)):
#     print(df["LOCATION"][i])
#     dict.update({str(df["LOCATION"][i].value()): {df["INDICATOR"]: [i]}})


# Put the dictionary into a json file
with open('data.json', 'w') as outfile:
    json.dump(df.to_json(orient="index"), outfile)
