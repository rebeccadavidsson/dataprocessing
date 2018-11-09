#!/usr/bin/env python
# Name: Rebecca Davidsson
# Student number: 11252138
"""
Exploratory data analysis.
"""

import csv
import re
import statistics as calc
import json
import pandas as pd
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt

IMPORT_CSV = 'input.csv'


def load_data():
    """
    Load data into a dataframe.
    """

    with open(IMPORT_CSV) as input:
        input = csv.reader(input, delimiter=',')
        # Skip file header
        next(input)

        countries = []
        regions = []
        density = []
        mortality = []
        GDP = []

        for row in input:
            # Skip empty rows
            if row:
                countries.append(row[0])
                regions.append(row[1].strip(" "))
                density.append(row[4])

                # Skip empty fields
                if row[7]:
                    mortality_rate = float(str(row[7]).replace(",", "."))
                else:
                    mortality_rate = []
                mortality.append(mortality_rate)

                GDPs = row[8]
                # Skip empty fieds
                GDP_int = [int(s) for s in re.findall(r'\d+', GDPs)]
                if GDP_int:
                    GDP_int = GDP_int[0]
                else:
                    GDP_int = 0
                GDP.append(GDP_int)

        dict = {'countries': countries,
                'regions': regions,
                'Pop. density': density,
                'Infant mortality': mortality,
                'GDP': GDP}

        # Make a dataframe
        frame = pd.DataFrame(dict)

        GDPs = ignore_empty_fields(frame.GDP)
        # print(calc.mean(GDPs))
        # print(calc.median(GDPs))
        # print(calc.mode(GDPs))
        # print(calc.pstdev(GDPs))

        y = GDPs
        x = get_index_numbers(GDPs)

        #plot_data(x, y)

        # mortality_rate = ignore_empty_fields(frame.mortality)
        # print(calc.mean(mortality_rate))
        # plt.boxplot(mortality_rate)
        # plt.show()

        data = []

        # Make a dictionary for every country
        for i in range(len(countries)):
            data.append(json.dumps({countries[i]:
                        {'Region': regions[i],
                         'Pop. density': density[i],
                         'Infant mortality (per 1000 births)': mortality[i],
                         'GDP ($ per capita) dollars': GDP[i]}},
                         indent=2))

        # Put the dictionaries into a json file
        with open('data.json', 'w') as outfile:
            json.dump(data, outfile)


def get_index_numbers(data):
    """
    Gets the index numbers for the y-label in a plot.
    """
    index = []
    for i in range(0, len(data)):
        index.append(i)

    return index


def ignore_empty_fields(data):
    """
    Ignores empty fields in a specific column.
    """
    list = []
    for row in data:
        if row:
            list.append(row)

    return list


def plot_data(x, y):
    """
    Visualize data in a bar graph.
    """
    pass
    plt.bar(x, y)
    plt.ylabel("dollars", size=14)
    plt.xlabel("country number", size=14)
    plt.show()


if __name__ == "__main__":
    load_data()
