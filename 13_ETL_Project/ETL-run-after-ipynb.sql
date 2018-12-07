# Merge 2014 tables into 1 table
CREATE TABLE IF NOT EXISTS data_2014 AS SELECT referrals_minor_df_2014.nationality,
    referrals_minor_df_2014.female_minor,
    referrals_minor_df_2014.male_minor,
    referrals_minor_df_2014.total_minor,
    referrals_adult_df_2014.female_adult,
    referrals_adult_df_2014.male_adult,
    referrals_adult_df_2014.total_adult,
    referrals_all_df_2014.female_all,
    referrals_all_df_2014.male_all,
    referrals_all_df_2014.total_all,
    referrals_all_df_2014.year FROM
    referrals_all_df_2014,
    referrals_adult_df_2014,
    referrals_minor_df_2014
WHERE
    referrals_adult_df_2014.nationality = referrals_minor_df_2014.nationality
        AND referrals_adult_df_2014.nationality = referrals_all_df_2014.nationality;
  
  
 # Merge 2015 tables into 1 table  
	CREATE TABLE IF NOT EXISTS data_2015 AS SELECT minor_trafficking_UK_2015.nationality,
    minor_trafficking_UK_2015.`2015 Minor Total`,
    adult_trafficking_UK_2015.`2015 Adult Total`,
    all_trafficking_UK_2015.`2015 Total`,
    all_trafficking_UK_2015.year FROM
    minor_trafficking_UK_2015,
    adult_trafficking_UK_2015,
    all_trafficking_UK_2015
WHERE
    minor_trafficking_UK_2015.nationality = adult_trafficking_UK_2015.nationality
        AND minor_trafficking_UK_2015.nationality = all_trafficking_UK_2015.nationality;
        
        
# Merge 2016 tables into 1 table
    CREATE TABLE IF NOT EXISTS data_2016 AS SELECT minor_trafficking_UK_2016.nationality,
    minor_trafficking_UK_2016.`2016 Minor Total`,
    adult_trafficking_UK_2016.`2016 Adult Total`,
    all_trafficking_UK_2016.`2016 Total`,
    all_trafficking_UK_2016.year FROM
    minor_trafficking_UK_2016,
    adult_trafficking_UK_2016,
    all_trafficking_UK_2016
WHERE
    minor_trafficking_UK_2016.nationality = adult_trafficking_UK_2016.nationality
        AND minor_trafficking_UK_2016.nationality = all_trafficking_UK_2016.nationality;
        
        