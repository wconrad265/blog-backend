1. install extensions (done)
   1. cross-env
   2. express-async-erros
   3. super test
2. change package-json (done)
   1. change them to use cross env and different env variables
   2. test, start, dev
3. change .env (done)
   1. include database string for test database
4. change utils config  (done)
   1. change config to use different database based on env variables
   2. the env variables will change based on how we start the program
5. change logger utils (done)
   1. change them to not run when env variable is test
6. add error middleware
   1. add this to handle async errors
7. update list_helper_test.js
   1. update to connect to sample data
      1. create separate file to have sample data
   2. use super test on the api
   3. create function to load sample data into the database
   4. create test to verify that HTTP Get request works