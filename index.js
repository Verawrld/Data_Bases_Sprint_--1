const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'your_database_name', //This should be changed to reflect your actual database
  password: 'your_database_password', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS Movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      genre VARCHAR(255) NOT NULL,
      director VARCHAR(255) NOT NULL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS Customers (
      customer_id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(255) NOT NULL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS Rentals (
      rental_id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL,
      movie_id INT NOT NULL,
      rental_date DATE NOT NULL,
      return_date DATE NOT,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
      FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
      );
    `);
    console.log('Tables created successfully'); 
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    client.release();
  }
};

/**
 * Inserts a new movie into the Movies table.
 * 
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO Movies (title, year, genre, director)
      VALUES ($1, $2, $3, $4)
    `, [title, year, genre, director]);
    console.log('Movie inserted successfully');
  } catch (err) {
    console.error('Error inserting movie', err);
  } finally {
    client.release();
  }
};

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM Movies');
    console.log('Movies:');
    res.rows.forEach(row => {
      console.log(row);
    });
  } catch (err) {
    console.error('Error displaying movies', err);
  } finally {
    client.release();
  }
};

/**
 * Updates a customer's email address.
 * 
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  const client = await pool.connect();
  try {
    await client.query(`
      UPDATE Customers
      SET email = $1
      WHERE customer_id = $2
    `, [newEmail, customerId]);
    console.log('Customer email updated successfully');
  } catch (err) {
    console.error('Error updating customer email', err);
  } finally {
    client.release();
  }
};

/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM Rentals WHERE customer_id = $1', [customerId]);
    await client.query('DELETE FROM Customers WHERE customer_id = $1', [customerId]);
    console.log('Customer removed successfully');
  } catch (err) {
    console.error('Error removing customer', err);
  } finally {
    client.release();
  }
};

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
};

runCLI();
