const Blog = require('../models/Blog');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createBlog = async (req, res) => {
    req.body.createdBy = req.user.id
    const blog = await Blog.create(req.body)
    res.status(StatusCodes.OK).json({ blog })
}

const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find({ createdBy: req.user.id })
    res.status(StatusCodes.OK).json({ blogs, count: blogs.length })
}

const getBlog = async (req, res) => {
    const { user: { _id }, params: { id: blogId } } = req

    const blog = await Blog.find({ _id: blogId, createdBy: _id })
    console.log(blog);
    if (!blog) {
        throw new NotFoundError(`No job with id ${blogId}`)
    }

    res.status(StatusCodes.OK).json({ blog })
}

const updateBlog = async (req, res) => {
    const {
        body: { title, body },
        user: { _id },
        params: { id: blogId }
    } = req



    if (title === '' || body === '') {
        throw new BadRequestError('Title or body field cannt be emapty')
    }

    const blog = await Blog.findByIdAndUpdate({ _id: blogId, createdBy: _id }, req.body, { new: true, runValidators: true })

    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`)
    }

    res.status(StatusCodes.OK).json({ blog })
}

const deleteBlog = async (req, res) => {

    const {
        user: { _id },
        params: { id: blogId }
    } = req

    const blog = await Blog.findOneAndDelete({ createdBy: _id, _id: blogId })

    res.status(StatusCodes.OK).json({ blog })
}



module.exports = { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog }