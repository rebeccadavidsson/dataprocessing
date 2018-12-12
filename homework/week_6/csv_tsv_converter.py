"""
This script adds selected data from a CSV file to an existing TSV-file.
Name: Rebecca Davidsson, student number: 11252138.
"""

import csv
import re


with open("HPI_csv.csv") as tsvfile:
    HPI = csv.reader(tsvfile, delimiter=';')
    # Skip header
    next(HPI)
    HPIdata = []
    for row in HPI:
        HPIdata.append(row)

    with open("world_population.tsv") as tsvfile:
        reader = csv.reader(tsvfile, delimiter='\t')
        # Skip header
        next(reader)
        WORLDdata = []
        for line in reader:
            WORLDdata.append(line)

        # Open a new tsv file
        with open("test.tsv", "w") as output:
            writer = csv.writer(output, delimiter='\t')

            all = []

            # Iterate through every row in HPI data and WORLDdata
            # to find corresponding country
            for row in HPIdata:
                for line in WORLDdata:
                    if line[1] == row[0]:
                        line.append(float(row[3].replace(',', '.')))
                        line.append(float(row[2].replace(',', '.')))
                        line.append(float(row[4].rstrip("%")))
                        line.append(float(row[5].replace(',', '.')))
                        line.append(float(row[6].replace(',', '.')))
                        all.append(line)
            writer.writerows(all)
