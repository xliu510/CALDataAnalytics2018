from flask import Flask, jsonify, render_template, request, redirect
from flask_pymongo import PyMongo
import scrape_mars
import pymongo

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

# Route to render index.html template using data from Mongo
@app.route("/")
def index():
    mars_data = mongo.db.mars.find_one()
    return render_template("index.html", mars_info=mars_data)

# Route to scrape needed info to generate index.html page
@app.route("/scrape")
def scrape():
    mars_data = mongo.db.mars
    new_data = scrape_mars.Scrape()
    mars_data.update({}, new_data, upsert=True)
    return redirect("/", code="302")


if __name__ == "__main__":
    app.run(debug=False)
