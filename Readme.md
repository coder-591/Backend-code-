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

- This error come from optional chaining or checking

# How data flows from front-end to back-end

<b>1.User Fills the Login Form</b><br>

<b>2. Browser Creates an HTTP Request</b><br>
<b>Request contains that what type of method you use e.g(get,post, etc.) ?, what type of host is ?,What type of content of the data and its length.Finally the data you fill in login form</b><br>

1- POST /login HTTP/1.1 <br>
2- Host: localhost:5000 <br>
3- Content-Type: application/json <br>
4- Content-Length: 42 <br>
5- {
"email": "test@gmail.com",
"password": "12345"
}<br>

<b>3.Data Travels Over the Network</b><br>

The browser sends this HTTP request over TCP/IP → goes through your OS → network stack → reaches your backend server (e.g. Express).

<b>4.Server Receives Request</b><br>

In Node.js (Express), the server sees:<br>
1- req.method → POST<br>
2- req.url → /login<br>
3- req.headers → { "content-type": "application/json", ... }<br>
4- req.body → not ready yet (still a raw stream!)<br>

<b>5.Express Middleware Parses Body</b><br>

When you add in your code it parses or read the raw data and convert into json format or JS object and lastly it attach the converted data with req.body => it is by default "undefiend":<br>
* app.use(express.json());<br>

<b>Flow in One Line</b><br>

* Form → Browser builds HTTP request → Sends over network → Server receives raw stream → Middleware parses → Data attached to req.body.





