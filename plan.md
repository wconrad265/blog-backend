<!-- 1. Set up posgress database
2. Install pg
3. add postgres connection string to .env file
4. add postgres uri to config file
5. create db-query.js
   1. copy file from LS189 and update it to work with our new database
6. copy over pg persistance
   1. we only need the sections that relate to user information
7. update routes in user router to use pg persistance -->
8. update login route to work with pg persistance
9. update middleware
   1.  userExtractor to search postgress database for user
10. update blogs controller routes
    1.  