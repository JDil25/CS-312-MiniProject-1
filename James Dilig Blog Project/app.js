const express = require('express'); // Import the express module
const app = express(); // Create an instance of the express app
const port = 3000; // Define the port on which the server will run

let posts = []; // Initialize an array to hold blog posts, this acts as temporary storage since we are not using a database

// Set up EJS as the templating engine
app.set('view engine', 'ejs'); // Configure the app to use EJS for rendering views (HTML templates)

// Middleware to parse URL-encoded data from the body of POST requests
app.use(express.urlencoded({ extended: true })); 
// Middleware to serve static files (CSS, images, JavaScript) from the 'public' directory
app.use(express.static('public')); 

// Routes

// GET route for rendering the form to create a new blog post
app.get('/create', (req, res) => {
    res.render('create'); // Render the 'create.ejs' view to display the form for creating a new post
});

// POST route to handle form submissions for creating a new blog post
app.post('/create', (req, res) => {
    const { title, content, name } = req.body; // Destructure the form data (title, content, name) from the request body
    const newPost = {
        id: posts.length + 1, // Generate a unique ID for the new post based on array length
        title, // Post title
        content, // Post content
        name, // Post author's name
        date: new Date().toLocaleString() // Store the creation date of the post
    };
    posts.push(newPost); // Add the new post to the 'posts' array
    res.redirect('/'); // Redirect the user back to the homepage after creating the post
});

// GET route to display all blog posts on the homepage
app.get('/', (req, res) => {
    res.render('index', { posts }); // Render the 'index.ejs' view, passing the 'posts' array to display the list of posts
});

// GET route to render the form for editing an existing blog post
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id); // Find the post by its ID
    res.render('edit', { post }); // Render the 'edit.ejs' view, passing the specific post to pre-fill the form fields
});

// POST route to handle the form submission for editing an existing post
app.post('/edit/:id', (req, res) => {
    const { title, content, name } = req.body; // Destructure the updated data from the request body
    const postIndex = posts.findIndex(p => p.id == req.params.id); // Find the index of the post to update by its ID
    // Update the existing post at the found index with new data
    posts[postIndex] = { ...posts[postIndex], title, content, name }; 
    res.redirect('/'); // Redirect back to the homepage after editing
});

// POST route to handle deletion of a blog post
app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id); // Remove the post with the given ID from the 'posts' array
    res.redirect('/'); // Redirect to the homepage after deletion
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); // Log a message to indicate the server is running
});