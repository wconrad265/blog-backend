<!-- - Add the name field to usernames and make it required -->
<!-- - Implement token-based authentication according to part 4 chapter Token authentication. (done) -->
<!-- - validate that a valid token must is sent with the HTTP post request -->
<!-- - refactor taking the token extractor to a middleware. The middleware should take the token from the Authorization header and assign it to the token field of the request object. -->
- Blogs can only be deleted by users who added it
  - the token sent with the request, must match the original blog creator
- create user extractor
  - adds the username to the request
- Fix all the tests
- Write a nest test that ends with a proper status code is a token is not provided