require('dotenv').config()
require('express-async-errors');
const express = require('express');
const app = express();
const blogsRouter = require('./routes/blogs')
const authRouter = require('./routes/auth')
const connectDB = require('./db/connect');

const authMiddleware = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')



app.use(express.json());


app.use('/api/v1/users', authRouter)
app.use('/api/v1/blogs', authMiddleware ,blogsRouter)
// app.use('/api/v1/blogs/:id/share', authMiddleware ,blogsRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Database connection established...')
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (err) {
        console.log(`Error connecting to db: ${err}`);
    }
};

start();