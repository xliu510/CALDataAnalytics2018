### Select Database
`USE sakila;`

##### 1a. Display the first and last names of all actors from the table actor.

```
SELECT first_name AS `Actor First Name`, last_name AS `Actor Last Name`
FROM actor;
```

##### 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.

```
SELECT UPPER(CONCAT(first_name, ' ', last_name)) AS `Actor Full Name`
FROM actor;
```

##### 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?

```
SELECT actor_id AS `Actor ID`, first_name AS `Actor First Name`, last_name AS `Actor Last Name`
FROM actor WHERE first_name = 'Joe';
```

##### 2b. Find all actors whose last name contain the letters GEN:

```
SELECT actor_id AS `Actor ID`, first_name AS `Actors First Name`, last_name AS `Actors Last Name Containing Letters GEN`
FROM actor
WHERE last_name LIKE '%GEN%';
```

##### 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:

```
SELECT actor_id AS `Actor ID`, first_name AS `Actors First Name`, last_name AS `Actors Last Name Containing Letters LI`
FROM actor
WHERE last_name LIKE '%LI%'
ORDER BY last_name, first_name;
```

##### 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:

```
SELECT country_id AS `Country ID`, country AS Country
FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');
```

##### 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).

```
ALTER TABLE actor ADD COLUMN description BLOB;
```

##### 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.

```
ALTER TABLE actor DROP COLUMN description;
```

##### 4a. List the last names of actors, as well as how many actors have that last name.

```
SELECT last_name AS `Last Name`, COUNT(last_name) AS `Number of Actors with Last Name`
FROM actor
GROUP BY last_name;
```

##### 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors

```
SELECT last_name AS `Last Name`, COUNT(last_name) AS `Last Name Count`
FROM actor
GROUP BY last_name
HAVING COUNT(last_name) >= 2
ORDER BY COUNT(last_name) DESC;
```

##### 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.

```
UPDATE actor SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' and last_name = 'WILLIAMS';
```

##### 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.

```
UPDATE actor
SET first_name = CASE
WHEN first_name = 'HARPO'
THEN 'GROUCHO'
END
WHERE actor_id = 172;
```

##### 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?

```
CREATE SCHEMA address;
DESCRIBE sakila.address;
DROP SCHEMA address;

SHOW CREATE TABLE address;
CREATE TABLE IF NOT EXISTS
 `address` (
 `address_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
 `address` varchar(50) NOT NULL,
 `address2` varchar(50) DEFAULT NULL,
 `district` varchar(20) NOT NULL,
 `city_id` smallint(5) unsigned NOT NULL,
 `postal_code` varchar(10) DEFAULT NULL,
 `phone` varchar(20) NOT NULL,
 `location` geometry NOT NULL,
 `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`address_id`),
 KEY `idx_fk_city_id` (`city_id`),
 SPATIAL KEY `idx_location` (`location`),
 CONSTRAINT `fk_address_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8;
```

##### 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:

```
SELECT staff.first_name AS `First Name`, staff.last_name AS `Last Name`, address.address AS `Address`, city.city AS `City`, country.country AS `Country`
FROM staff
INNER JOIN address ON staff.address_id = address.address_id
INNER JOIN city ON address.city_id = city.city_id
INNER JOIN country ON city.country_id = country.country_id;
```

##### 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.

```
SELECT staff.first_name AS `First Name`, staff.last_name AS `Last Name`, CONCAT('$', FORMAT(SUM(payment.amount), 2)) AS `Total Amount Rung Up By Each Staff`
FROM staff
INNER JOIN payment ON staff.staff_id = payment.staff_id
WHERE MONTH(payment_date) >= 8 AND MONTH(payment_date) < 9 AND YEAR(payment_date) = 2005
GROUP BY payment.staff_id;
```

##### 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.

```
SELECT title AS Title, COUNT(actor_id) AS `Number of Actors`
FROM film
JOIN film_actor
ON film.film_id = film_actor.film_id
GROUP BY title;
```

##### 6d. How many copies of the film Hunchback Impossible exist in the inventory system?

```
SELECT title AS Title, COUNT(inventory_id) AS `Number of Copies`
FROM film
INNER JOIN inventory ON film.film_id = inventory.film_id
WHERE title = 'Hunchback Impossible';
```

##### 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:

```
SELECT first_name AS `First Name`, last_name AS `Last Name`, CONCAT('$', FORMAT(SUM(amount), 2)) AS `Total Amount Paid` FROM customer
JOIN payment
ON customer.customer_id = payment.customer_id
GROUP BY last_name, first_name
ORDER BY last_name ASC;
```

##### 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.

```
SELECT title AS `English Films Starting With Letters K and Q` FROM film
WHERE language_id IN
	(
		SELECT language_id
		FROM language
		WHERE name = "English"
	)
AND
	(
		title LIKE "K%"
	)
OR
	(
	title LIKE "Q%"
  );
```

##### 7b. Use subqueries to display all actors who appear in the film Alone Trip.

```
SELECT first_name AS `First Name`, last_name AS `Last Name` FROM actor
WHERE actor_id IN
	(
		SELECT actor_id FROM film_actor
		WHERE film_id =
			(
				SELECT film_id FROM film
				WHERE title = 'Alone Trip'
			)
	);
```

##### 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.

```
SELECT first_name AS `First Name`, last_name AS `Last Name`, email AS Email
FROM customer
INNER JOIN address
ON address.address_id = customer.address_id
INNER JOIN city
ON city.city_id = address.city_id
INNER JOIN country
ON city.country_id = country.country_id
WHERE country = 'Canada';
```

##### 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.

```
SELECT title AS `Family Friendly Films` FROM film
WHERE film_id IN
	(
		SELECT film_id FROM film_category
        WHERE category_id =
			(
				SELECT category_id FROM category
                WHERE name = 'Family'
			)
	);
```

##### 7e. Display the most frequently rented movies in descending order.

```
SELECT film.title AS Title, COUNT(*) AS 'Rent Count'
FROM film, inventory, rental
WHERE film.film_id = inventory.film_id AND rental.inventory_id = inventory.inventory_id
GROUP BY inventory.film_id
ORDER BY COUNT(*) DESC, film.title ASC;
```


##### 7f. Write a query to display how much business, in dollars, each store brought in.

```
SELECT staff_id AS `Store Number`, CONCAT('$', FORMAT(SUM(amount), 2)) AS `Total Business in Dollars`
FROM payment
GROUP BY staff_id;
```

##### 7g. Write a query to display for each store its store ID, city, and country.

```
SELECT store_id AS 'Store ID', city AS City, country AS Country FROM store
INNER JOIN address
ON address.address_id = store.address_id
INNER JOIN city
ON city.city_id = address.city_id
INNER JOIN country
ON country.country_id = city.country_id;
```

##### 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)

```
SELECT name AS `Genre Name`, CONCAT('$', FORMAT(SUM(amount), 2)) AS `Gross Revenue` FROM category
INNER JOIN film_category
ON film_category.category_id = category.category_id
INNER JOIN inventory
ON inventory.film_id = film_category.film_id
INNER JOIN rental
ON rental.inventory_id = inventory.inventory_id
INNER JOIN payment
ON payment.rental_id = rental.rental_id
GROUP BY name
ORDER BY SUM(amount) DESC
LIMIT 5;
```

##### 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.

```
CREATE VIEW top_five_genres AS
SELECT name AS `Genre Name`, CONCAT('$', FORMAT(SUM(p.amount), 2)) AS `Gross Revenue`
FROM category c
INNER JOIN film_category fc ON fc.category_id = c.category_id
INNER JOIN inventory i ON i.film_id = fc.film_id
INNER JOIN rental r ON r.inventory_id = i.inventory_id
INNER JOIN payment p ON p.rental_id = r.rental_id
GROUP BY `Genre Name`
ORDER BY `Gross Revenue` DESC
LIMIT 5;
```

##### 8b. How would you display the view that you created in 8a?

```
SELECT * FROM top_five_genres;
```

##### 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.

```
DROP VIEW top_five_genres;
```
