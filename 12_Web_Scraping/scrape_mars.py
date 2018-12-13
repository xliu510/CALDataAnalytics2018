# Import dependencies
from bs4 import BeautifulSoup
from splinter import Browser
import pandas as pd
import requests
import pymongo
import time

# Scraping function
def Scrape():

    print('---------------------')
    print('INITIATE SCRAPING')
    print('---------------------')

    # Empty Dictionary
    mars_dict = {}

    ########## NASA Mars News ##########

    # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)

    # Mars News URL
    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)

    # Retrieve page with the requests module
    html = browser.html

    # Create BeautifulSoup object; parse with 'html.parser'
    soup = BeautifulSoup(html, 'html.parser')

    # Get title & description
    news_title = soup.find('div', 'content_title', 'a').text
    news_p = soup.find('div', 'rollover_description_inner').text
    
    # Adding to mars_dict
    mars_dict['news_title'] = news_title
    mars_dict['news_p'] = news_p
    print('----------------------------------')
    print('Title and Description Acquired')
    print('----------------------------------')

    ########## JPL Mars Space Images ##########
    # JPL Mars URL
    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"

   # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Moving through the pages
    time.sleep(5)
    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(5)
    browser.click_link_by_partial_text('more info')
    time.sleep(5)

    # Create BeautifulSoup object; parse with 'html.parser'
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Get featured image
    result = soup.find('article')
    extension = result.find('figure', class_='lede').a['href']
    link = 'https://www.jpl.nasa.gov'
    featured_image_url = link + extension

    # Adding to mars_dict
    mars_dict["featured_image_url"] = featured_image_url
    print('---------------------------')
    print('Featured Image Acquired')
    print('---------------------------')

    ########## Mars Weather ##########
    # Mars Twitter URL
    url = 'https://twitter.com/marswxreport?lang=en'

   # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Create BeautifulSoup Object and parsing using html.parser
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    tweet = soup.find('div', class_='js-tweet-text-container').text.strip()

    # Adding to mars_dict
    mars_weather = tweet
    mars_dict["mars_weather"] = mars_weather
    print('------------------')
    print('Tweet Acquired')
    print('------------------')

    ########## Mars Facts ##########
    # Mars Facts URL
    url = "https://space-facts.com/mars/"

    # Retrieve page with the requests module
    html = requests.get(url)

    # Create BeautifulSoup object; parse with 'html.parser'
    soup = BeautifulSoup(html.text, 'html.parser')

    # Empty dictionary for info
    mars_profile = {}

    # Getting row info
    results = soup.find('tbody').find_all('tr')

    # Storing info into dictionary
    for result in results:
        key = result.find('td', class_='column-1').text.split(":")[0]
        value = result.find('td', class_='column-2').text.split("\n")

        mars_profile[key] = value

    # Creating a DataFrame
    mars_facts_df = pd.DataFrame([mars_profile]).T.rename(columns={0: 'Value'})

    # Converting to html
    mars_facts_html = "".join(mars_facts_df.to_html().split("\n"))

    # Adding to mars_dict
    mars_dict["profile_html"] = mars_facts_html
    print('------------------')
    print('Facts Acquired')
    print('------------------')

    ########## Mars Hemispheres ##########

    # Mars Hemispheres URL
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"

    # Empty list of image urls
    hemisphere_image_urls = []

    ########## Cerberus ##########
    # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Moving through pages
    time.sleep(5)
    browser.click_link_by_partial_text('Cerberus Hemisphere Enhanced')
    time.sleep(5)

    # Create BeautifulSoup object; parse with 'html.parser'
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Store link
    cerberus_link = soup.find('div', 'downloads').a['href']

    # Create dictionary
    cerberus = {
        "title": "Cerberus Hemisphere",
        "img_url": cerberus_link
    }

    # Appending dictionary
    hemisphere_image_urls.append(cerberus)

    ########## Schiaparelli ##########
    # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Moving through pages
    time.sleep(5)
    browser.click_link_by_partial_text('Schiaparelli Hemisphere Enhanced')
    time.sleep(5)

    # Create BeautifulSoup object; parse with 'html.parser'
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Store link
    schiaparelli_link = soup.find('div', 'downloads').a['href']

    # Create dictionary
    schiaparelli = {
        "title": "Schiaparelli Hemisphere",
        "img_url": schiaparelli_link
    }

    # Appending dictionary
    hemisphere_image_urls.append(schiaparelli)

    ########## Syrtis Major ##########
    # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Moving through pages
    time.sleep(5)
    browser.click_link_by_partial_text('Syrtis Major Hemisphere Enhanced')
    time.sleep(5)

    # Create BeautifulSoup object; parse with 'html.parser'
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Store link
    syrtis_link = soup.find('div', 'downloads').a['href']

    # Create dictionary
    syrtis_major = {
        "title": "Syrtis Major Hemisphere",
        "img_url": syrtis_link
    }

    # Appending dictionary
    hemisphere_image_urls.append(syrtis_major)

    # Adding to dictionary
    mars_dict["hemisphere_image_urls"] = hemisphere_image_urls

    ########## Valles Marineris ##########
    # Setting up splinter
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=True)
    browser.visit(url)

    # Moving through pages
    time.sleep(5)
    browser.click_link_by_partial_text('Valles Marineris Hemisphere Enhanced')
    time.sleep(5)

    # Create BeautifulSoup object; parse with 'html.parser'
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Store link
    valles_link = soup.find('div', 'downloads').a['href']

    # Create dictionary
    valles_marineris = {
        "title": "Valles Marineris Hemisphere",
        "img_url": valles_link
    }

    # Appending dictionary
    hemisphere_image_urls.append(valles_marineris)

    print("-------------------------------")
    print("HEMISPHERE IMAGES ACQUIRED")
    print("-------------------------------")

    print("-----------------------")
    print("SCRAPING COMPLETED")
    print("-----------------------")

    return mars_dict
