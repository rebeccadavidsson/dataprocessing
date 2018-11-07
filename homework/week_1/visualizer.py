#!/usr/bin/env python
# Name: Rebecca Davidsson
# Student number: 11252138
"""
This script visualizes data obtained from a .csv file.
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = 'movies.csv'
START_YEAR = 2008
END_YEAR = 2018


def get_mean(key):
    """
    Calculates mean rating for each year.
    """

    # Start reading from beginning of file for each key
    with open(INPUT_CSV) as movies:
        movies = csv.reader(movies, delimiter=',')
        next(movies)

        ratings = []

        # Calculate mean rating of every year
        for row in movies:
            if key == int(row[2]):
                ratings.append(float(row[1]))
        rating = round((sum(ratings)/len(ratings)),3)

    return rating

def plot(dict):
    """
    Plots dictionary into a graph.
    """

    # Set x-axis and set y-axis values (minimum = 8 and maximum = 9.4)
    plt.ylim(8, 9.4)
    plt.title('Average ratings of top 50 movies')
    plt.ylabel('Average rating', fontsize = 18)
    plt.xlabel('Year', fontsize = 18)

    # Plot a line and bar in the same plot
    plt.plot(dict.keys(), dict.values(), color="red")
    plt.bar(dict.keys(), dict.values())
    plt.show()


if __name__ == "__main__":
    # Global dictionary for the data
    data_dict = {str(key): get_mean(key) for key in range(START_YEAR, END_YEAR)}
    plot(data_dict)
