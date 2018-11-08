#!/usr/bin/env python
# Name: Rebecca Davidsson
# Student number: 11252138
"""
This script ................................................
"""

import csv
import re
import statistics as calc
import pandas as pd
import matplotlib
matplotlib.use('PS')
import matplotlib.pyplot as plt

IMPORT_CSV = 'input.csv'

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
            regions.append(row[1])
            density.append(row[4])
            mortality.append(row[7])
            GDPs = row[8]
            # Check for empty fields
            GDP_int = [int(s) for s in re.findall(r'\d+', GDPs)]
            if GDP_int:
                GDP_int = GDP_int[0]
            GDP.append(GDP_int)

    dict = {'countries': countries, 'regions': regions, 'regions': regions, 'density': density, 'mortality': mortality, 'GDP': GDP}

    # Make a dataframe
    frame = pd.DataFrame(dict)

    GDPs = []

    for row in frame.GDP:
        if row:
            GDPs.append(row)
    print(calc.mean(GDPs))
    print(calc.median(GDPs))
    print(calc.mode(GDPs))
    print(calc.pstdev(GDPs))

    plt.bar(GDPs, GDPs)
