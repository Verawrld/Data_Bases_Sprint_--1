-- Create The Tables

CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INTEGER NOT NULL,
    genre VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
)

CREATE TABLE Customers (
    cutomer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number TEXT NOT NULL
);

CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customers(customer_id),
    movie_id INTEGER REFERENCES Movies(movie_id),
    rental_date DATE NOT NULL,
    return_date DATE
);

-- Insert Data movies

INSERT INTO Movies (title, release_year, genre, director) VALUES
('Spider-man 3', 2007, 'Action', 'Sam Raimi'),
('A Silet Voice', 2016, 'Romance','Naoko Yamada'),
('The Good Dinosaur' 2015, 'Family', 'Peter Sohn'),
('The Conjuring', 2013, 'Horror', 'James Wan'),
('The Land Before Timer' 1988, 'Family', 'Don Bluth');

-- Insert Data Customers

INSERT INTO Customers (first_name, last_name, email, phone_number) VALUES
('John', 'Doe', 'john.doe@hotmail.com', '123-456-7890'),
('Jane', 'Doe', 'Jane24@gmail.com', '098-765-4321'),
('Alice', 'Smith', 'AliceTheGreat@outlook.com', '456-789-1234'),
('Bob', 'Johnson', 'BobbyJohn@outlook.com', '789-123-4567'),
('Sara', 'Williams', 'SaraW@gmail.com', '321-654-9870');

-- Insert Data Rentals

INSERT INTO Rentals (customer_id, movie_id, rental_date, return_date) VALUES
(1, 1, '2023-01-01', '2023-01-10'),
(2, 2, '2023-01-02', '2023-01-11'),
(3, 3, '2023-01-03', '2023-01-12'),
(4, 4, '2023-01-04', '2023-01-13'),
(5, 5, '2023-01-05', '2023-01-14'),
(1, 2, '2023-01-06', '2023-01-15'),
(2, 3, '2023-01-07', '2023-01-16'),
(3, 4, '2023-01-08', '2023-01-17'),
(4, 5, '2023-01-09', '2023-01-18'),
(5, 1, '2023-01-10', '2023-01-19');

-- Query 1: Get all the movies that were rented by a customer with the first name of 'John'

SELECT m.title
FROM Rentals r
JOIN Customers c ON r.customer_id = c.customer_id
JOIN Movies m ON r.movie_id = m.movie_id
WHERE c.email = 'john.doe@hotmail.com';

-- Query 2: Given a movie title, get all the customers who rented this movie

SELECT c.first_name, c.last_name
FROM Rentals r 
JOIN Customers c ON r.customer_id = c.customer_id
JOIN Movies m ON r.movie_id = m.movie_id
WHERE m.title = 'A Silent Voice';

-- Query 3: Get the rental history from a specific movie title

SELECT c.first_name, c.last_name, r.rental_date, r.return_date
FROM Rentals r
JOIN Customers c ON r.customer_id = c.customer_id
JOIN Movies m ON r.movie_id = m.movie_id
WHERE m.title = 'The Good Dinosaur';

-- Query 4: From a specific movie director, get all the movies rented by customers

SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM Rentals r
JOIN Customers c ON r.customer_id = c.customer_id
JOIN Movies m ON r.movie_id = m.movie_id
WHERE m.director = 'Sam Raimi';

-- Query 5: List all current rented out movies

SELECT m.title
FROM Rentals 
JOIN Movies m ON Rentals.movie_id = m.movie_id
WHERE Rentals.return_date IS NULL or r.return_date > CURRENT_DATE;