import os
import csv
import sys

path = "election_data.csv"

with open(path, newline = "") as csvfile:
    csvreader = csv.reader(csvfile, delimiter = ",")
    csv_header = next(csvfile)

    Voter_Total = 0
    Khan_Total = 0
    Correy_Total = 0
    Li_Total = 0
    OTooley_Total = 0

    for row in (csvreader):
        Voter_Total = Voter_Total + 1
        if row[2] == "Khan":
            Khan_Total = Khan_Total + 1
        elif row[2] == "Correy":
            Correy_Total = Correy_Total + 1
        elif row[2] == "Li":
            Li_Total = Li_Total + 1
        else:
            OTooley_Total = OTooley_Total + 1

Khan_Percent = round((Khan_Total/Voter_Total)*100,2)
Correy_Percent = round((Correy_Total/Voter_Total)*100,2)
Li_Percent = round((Li_Total/Voter_Total)*100,2)
OTooley_Percent = round((OTooley_Total/Voter_Total)*100,2)

Candidate_Dic = {"Khan":Khan_Total,"Correy":Correy_Total,"Li":Li_Total,"OTooley":OTooley_Total}
Election_Winner = max(Candidate_Dic, key=lambda i: Candidate_Dic[i])

ER = "Election Results"
dash = "-"
dash = dash*25

print(f"\n{ER}\n{dash}\nTotal Votes: {Voter_Total}\n{dash}\nKhan: {Khan_Percent}% ({Khan_Total})\nCorrey: {Correy_Percent}% ({Correy_Total})\nLi: {Li_Percent}% ({Li_Total})\nOTooley: {OTooley_Percent}% ({OTooley_Total})\n{dash}\nWinner: {Election_Winner}\n{dash}")

sys.stdout = open("main_PyPoll_Xing.txt", "w")
print(f"\n{ER}\n{dash}\nTotal Votes: {Voter_Total}\n{dash}\nKhan: {Khan_Percent}% ({Khan_Total})\nCorrey: {Correy_Percent}% ({Correy_Total})\nLi: {Li_Percent}% ({Li_Total})\nOTooley: {OTooley_Percent}% ({OTooley_Total})\n{dash}\nWinner: {Election_Winner}\n{dash}")
