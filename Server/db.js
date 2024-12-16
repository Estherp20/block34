const pg = require('pg');
const uuid = require('uuid');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservations_db');


const createTables = async()=> {
    const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS hotels;
        CREATE TABLE users(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE hotels(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            departure_date DATE NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            hotels_id UUID REFERENCES hotels(id) NOT NULL
        );
    `;
    
    await client.query(SQL);
};


const createUser = async(name)=> {
    const SQL = `
      INSERT INTO users(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };
  
  const createHotel = async(name)=> {
    const SQL = `
      INSERT INTO hotel(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  }; 

  const fetchUsers = async()=> {
    const SQL = `
  SELECT *
  FROM users
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchHotel = async()=> {
    const SQL = `
  SELECT *
  FROM hotels
    `;
    const response = await client.query(SQL);
    return response.rows;
  };    
  
  const createReservation = async({ hotel_id, user_id, departure_date})=> {
    const SQL = `
      INSERT INTO reservation(id, hotel_id, user_id, departure_date) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), hotel_id, user_id, departure_date]);
    return response.rows[0];
  };
  
  
  const fetchReservation = async()=> {
    const SQL = `
  SELECT *
  FROM reservation
    `;
    const response = await client.query(SQL);
    return response.rows;
  }; 


module.exports = {
  client,
  createTables,
  createUser,
  createHotel,
  fetchHotel,
  fetchUsers,
  createReservation,
  fetchReservation,
}; 