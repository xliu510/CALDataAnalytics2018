# Dropping Database
DROP DATABASE if exists ETL_Traffic_UK;

# Creating Database
CREATE DATABASE if not exists ETL_Traffic_UK;
USE ETL_Traffic_UK;


#################################################
# 2014 DataBase
#################################################

# Creating 2014 Minor DataBase
CREATE TABLE  if not exists referrals_minor_df_2014 (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nationality TEXT,
   female_minor INT,
   male_minor INT,
   total_minor INT,
   year INT
);

# Creating 2014 Adult DataBase
CREATE TABLE  if not exists referrals_adult_df_2014 (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nationality TEXT,
   female_adult INT,
   male_adult INT,
   total_adult INT,
   year INT
);

# Creating 2014 All DataBase
CREATE TABLE  if not exists referrals_all_df_2014 (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nationality TEXT,
   female_all INT,
   male_all INT,
   total_all INT,
   year INT
);

       
#################################################
# 2015 DataBase
#################################################

# Creating 2015 Minor DataBase
CREATE TABLE if not exists minor_trafficking_uk_2015 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2015 Minor Total` INT,
	PRIMARY KEY(id));

# Creating 2015 Adult DataBase
CREATE TABLE if not exists adult_trafficking_uk_2015 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2015 Adult Total` INT,
	PRIMARY KEY(id));

# Creating 2015 All DataBase
CREATE TABLE if not exists all_trafficking_uk_2015 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2015 Total` INT,
	PRIMARY KEY(id));
    

# Creating 2015 Minor and Adult DataBase
CREATE TABLE if not exists trafficking_uk_2015 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude Minor` INT,
    `Labour Exploitation Minor` INT,
    `Organ Harvesting Minor` INT,
    `Sexual Exploitation Minor` INT,
    `Unknown Exploitation Minor` INT,
    `2015 Minor Total` INT,
	`Domestic Servitude Adult` INT,
    `Labour Exploitation Adult` INT,
    `Organ Harvesting Adult` INT,
    `Sexual Exploitation Adult` INT,
    `Unknown Exploitation Adult` INT,
    `2015 Adult Total` INT,
	PRIMARY KEY(id));
    
    
#################################################
# 2016 DataBase
#################################################

# Creating 2016 Minor DataBase
CREATE TABLE if not exists minor_trafficking_uk_2016 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2016 Minor Total` INT,
	PRIMARY KEY(id));

# Creating 2016 Adult DataBase
CREATE TABLE if not exists adult_trafficking_uk_2016 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2016 Adult Total` INT,
	PRIMARY KEY(id));

# Creating 2016 All DataBase
CREATE TABLE if not exists all_trafficking_uk_2016 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude` INT,
    `Labour Exploitation` INT,
    `Organ Harvesting` INT,
    `Sexual Exploitation` INT,
    `Unknown Exploitation` INT,
    `2016 Total` INT,
	PRIMARY KEY(id));
    show tables;
    
# Creating 2016 Minor and Adult DataBase
CREATE TABLE if not exists trafficking_uk_2016 (
	id INT NOT NULL AUTO_INCREMENT,
	Year INT,
	Nationality VARCHAR(250),
    `Domestic Servitude Minor` INT,
    `Labour Exploitation Minor` INT,
    `Sexual Exploitation Minor` INT,
    `Unknown Exploitation Minor` INT,
    `2016 Minor Total` INT,
	`Domestic Servitude Adult` INT,
    `Labour Exploitation Adult` INT,
    `Organ Harvesting Adult` INT,
    `Sexual Exploitation Adult` INT,
    `Unknown Exploitation Adult` INT,
    `2016 Adult Total` INT,
	PRIMARY KEY(id));