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


@app.route("/scrape")
def scrape():
    mars_data = scrape_mars.Scrape()
    mars_info.update({}, mars_data, upsert=True)

    return redirect("/")


if __name__ == "__main__":
    app.run(debug=False)
