#!/usr/bin/env python
# Name: Rebecca Davidsson
# Student number: 11252138
"""
Exploratory data analysis. Input is a csv file with information of countries.
Output is an analyzed .json file.
"""

import statistics as calc
import json
import pandas as pd
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt


def load_data():
    # Make a pandaframe of data
    input = pd.read_csv('input.csv')
    # df = df.drop(df[df.score < 50].index)

    # Select relevant columns
    input = input[['Country', 'Region',
                  'Pop. Density (per sq. mi.)',
                   'GDP ($ per capita) dollars',
                   'Infant mortality (per 1000 births)']]

    # Delete empty rows
    input = input.dropna()

    # Take out unknown figures and outliers
    input = input[input['GDP ($ per capita) dollars'] != 'unknown']
    input = input[input['GDP ($ per capita) dollars'] != '400000 dollars']
    input = input[input['Pop. Density (per sq. mi.)'] != 'unknown']

    # Extract relevant data
    countries = input['Country']

    # Take out the word 'dollars', append remaining integers in a list
    GDP = []
    for row in input['GDP ($ per capita) dollars']:
        GDP.append(int(row.split(" ")[0]))

    # Convert density and mortality to float
    density = []
    for row in input['Pop. Density (per sq. mi.)']:
        density.append(float(row.replace(',', '.')))
    mortality = []
    for row in input['Infant mortality (per 1000 births)']:
        mortality.append(float(row.replace(',', '.')))

    # Take out extra spaces
    region = []
    for row in input['Region']:
        region.append(row.strip())

    # Make a dictionary of relevant data
    dict = {'countries': countries,
            'regions': region,
            'Pop. density': density,
            'Infant mortality': mortality,
            'GDP': GDP}

    calculate(GDP)
    boxplot(mortality)
    make_json(input, countries, region, density, mortality, GDP)
    scatterplot(GDP, mortality)


def calculate(GDP):
    """
    Calculate mean, median, mode and standard deviation of GDP.
    """

    print("Mean =", round(calc.mean(GDP), 3))
    print("Median =", calc.median(GDP))
    print("GDP =", calc.mode(GDP))
    print("Standard deviation = ", round(calc.pstdev(GDP), 3))

    # Plot a histogram of GDP
    plt.hist(GDP)
    plt.ylabel("Rate", size=14)
    plt.xlabel("Dollars", size=14)
    plt.title("GDP ($ per capita) dollars")
    plt.show()


def boxplot(mortality):
    """
    Make a boxplot of mortality rates using the Five Number Summary.
    """

    plt.title("Infant mortality (per 1000 births)")
    plt.xlabel(" ")
    plt.boxplot(mortality, showmeans=True)
    plt.show()


def make_json(input, countries, region, density, mortality, GDP):
    """
    Convert dataframe to a json file.
    """

    json_data = {}
    for i in range(len(input)):
        json_data.update({countries.values[i]:
                         {'Region:': region[i],
                          'Pop. density': density[i],
                          'Infant mortality (per 1000 births)': mortality[i],
                          'GDP ($ per capita) dollars': GDP[i]}})

    # Put the dictionary into a json file
    with open('data.json', 'w') as outfile:
        json.dump(json_data, outfile)


def scatterplot(GDP, mortality):
    """
    Makes a scatterplot of GDP and infant mortality.
    """

    plt.xlabel('GDP ($ per capita) dollars')
    plt.ylabel('Infant mortality (per 1000 births)')
    plt.scatter(GDP, mortality)
    plt.show()


if __name__ == "__main__":
    load_data()
