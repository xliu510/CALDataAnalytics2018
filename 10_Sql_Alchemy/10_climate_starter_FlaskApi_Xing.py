#################################################
# Importing Modules
#################################################

import numpy as np
import pandas as pd
import datetime as dt, datetime
from flask import Flask, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes Main Page
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""

    # Assigning links to display the query results
    return (
        f"<h3>Available Routes:</h3>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/><br/>"
        f"For the two queries below, please input dates between <strong>2010-01-01</strong> and <strong>2017-08-22</strong><br/><br/>"
        f"/api/v1.0/< start ><br/>"
        f"/api/v1.0/< start >/< end >"
            )

#################################################
# Flask Routes Precipitation
#################################################

@app.route("/api/v1.0/precipitation")
def precipitation():

    """Return precipitation data as json"""

    # Query all Measurement
    prcp_results = session.query(Measurement).all()

    # Creating a dictionary and appending a list of Measurements to it
    all_prcp_results = []
    for prcp in prcp_results:
        prcp_dict = {}
        prcp_dict["date"] = prcp.date
        prcp_dict["precipitation"] = prcp.prcp
        all_prcp_results.append(prcp_dict)

    return jsonify(all_prcp_results)

#################################################
# Flask Routes Stations
#################################################

@app.route("/api/v1.0/stations")
def stations():

    """Return station data as json"""

    # Query all Stations
    station_results = session.query(Station.station).all()

    # Convert list of tuples into normal list
    all_station_names = list(np.ravel(station_results))

    return jsonify(all_station_names)

#################################################
# Flask Routes Temperature Observations
#################################################

@app.route("/api/v1.0/tobs")
def tobs():

    """Return Temperature Observations from previous year"""

    # Query date and tobs values from a year ago
    one_year_from_last_results = session.query(Measurement.date, Measurement.tobs)\
                        .filter(Measurement.date >= '2016-08-23').all()

    all_last_year_tobs = []
    for result in one_year_from_last_results:
        tobs_result_dict = {}
        tobs_result_dict['date'] = result.date
        tobs_result_dict['tobs'] = result.tobs
        all_last_year_tobs.append(tobs_result_dict)

    return jsonify(all_last_year_tobs)


###########################################################
# Flask Routes TMIN, TAVG, TMAX using Start and End Date
###########################################################

@app.route("/api/v1.0/<start>")
@app.route("/api/v1.0/<start>/<end>")
def descr(start, end=None):
    if end == None: end = session.query(Measurement.date).order_by(Measurement.date.desc()).first()[0]
    tobs = pd.read_sql(session.query(Measurement.tobs).filter(Measurement.date > start, Measurement.date <= end).statement, session.bind)

    # Create a tobs dictionary and adding a list of tob values
    tobs_dict = {}
    tobs_dict["TMIN"] = tobs.describe().loc[tobs.describe().index=='min']['tobs'][0]
    tobs_dict["TAVG"] = tobs.describe().loc[tobs.describe().index=='mean']['tobs'][0]
    tobs_dict["TMAX"] = tobs.describe().loc[tobs.describe().index=='max']['tobs'][0]

    return jsonify(tobs_dict)

#################################################
# Define Main Behavior
#################################################

if __name__ == '__main__':
    app.run(debug=True)
