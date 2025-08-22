# Steps for user creation
1- get user details from frontend <br> 
2- validation - not empty <br>
3- check if user is already exists: username, email <br>
4- check for images,check for avatar <br>
5- upload them cloudinary,avatar <br>
6- create user object - create entry in db <br>
7- remove password and refresh token field from response <br>
8- check user creation <br>
9- return res <br>

# Multer middleware or package
Multer looks at the incoming request.If the "Content-Type" is "multipart/form-data", it parses it.
<br>
For each file field, Multer:
<br>
Reads the binary data.
<br>
Stores the file (in memory or disk, depending on config).
<br>
Fills req.file (for single) or req.files (for multiple) with metadata like:
<br>
Multipart format:
<br>
This format contains binary file data + text fields together in chunks.

# .env Errors
1- Using wrong .env variable names.
<br>
2- .env file not being loaded (forgot dotenv.config() in your server.js).
<br>
3- Putting credentials in process.env but not restarting the server.

# TypeError: Cannot read properties of undefined
 * This error come from optional chaining or checking

# How data flows from front-end to back-end

<b>Browser Creates an HTTP Request</b>