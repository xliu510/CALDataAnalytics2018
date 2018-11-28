import os
import csv
import sys


path = "budget_data.csv"
with open(path, newline="") as csvfile:
    csvreader = csv.reader(csvfile, delimiter = ",")
    csv_header = next(csvfile)


    Month_Total = 0
    Profit_Loss_Total = 0
    First_List = []
    Diff_List = []
    x = 0

    def listsum(numList):
        theSum = 0
        for i in numList:
            theSum = theSum + i
        return theSum


    for row in (csvreader):
        Month_Total = Month_Total + 1
        Profit_Loss_Total += int(row[1])

        First = row[0]
        First_List.append(First)

        if x == 0:
            x = int(row[1])
        else:
            Diff = int(row[1]) - x
            Diff_List.append(Diff)
            x = int(row[1])


Diff_List.insert(0,0)
Total_Sum = listsum(Diff_List)
Total_Len = int((len(Diff_List)) - 1)
Avg_Profit_Loss = round((Total_Sum/Total_Len),2)
budget_dic = dict(zip(First_List,Diff_List))
Greatest_Increase = max(budget_dic, key=budget_dic.get)
Greatest_Decrease = min(budget_dic, key=budget_dic.get)


FA = "Financial Analysis"
dash = "-"
dash = dash*35


print(f"\n{FA}\n{dash}\nTotal Months: {Month_Total}\nTotal: ${Profit_Loss_Total}\nAverage Change: ${Avg_Profit_Loss}\nGreatest Increase in Profits: {Greatest_Increase} (${budget_dic[Greatest_Increase]}) \nGreatest Decrease in Profits: {Greatest_Decrease} (${budget_dic[Greatest_Decrease]})")
sys.stdout = open("PyBank.txt", "w")
print(f"\n{FA}\n{dash}\nTotal Months: {Month_Total}\nTotal: ${Profit_Loss_Total}\nAverage Change: ${Avg_Profit_Loss}\nGreatest Increase in Profits: {Greatest_Increase} (${budget_dic[Greatest_Increase]}) \nGreatest Decrease in Profits: {Greatest_Decrease} (${budget_dic[Greatest_Decrease]})")
