const Blog = require('../models/Blog');
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, Forbidden } = require('../errors');

const createBlog = async (req, res) => {
    req.body.createdBy = req.user.id
    const blog = await Blog.create(req.body)
    res.status(StatusCodes.OK).json({ msg: 'Created successfully' })
}

const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find({ $or: [{ createdBy: req.user._id }, { sharedWith: req.user._id }] })
    res.status(StatusCodes.OK).json({ blogs: blogs, count: blogs.length })
}

const getBlog = async (req, res) => {
    const { user: { _id }, params: { id: blogId } } = req

    const blog = await Blog.findOne({ _id: blogId })
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

    // console.log(body);

    if (title === '' || body === '') {
        throw new BadRequestError('Title or body field cannt be empty')
    }

    const isAuth = await Blog.findOne({_id: blogId, createdBy: _id })
    if(!isAuth) {
        throw new Forbidden('Permission denied')
    }

    const blog = await Blog.findOneAndUpdate({ _id: blogId }, { title, body }, { new: true, runValidators: true })

    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`)
    }

    res.status(StatusCodes.OK).json({ msg: 'Updated successfully' })
}

const deleteBlog = async (req, res) => {

    const {
        user: { _id },
        params: { id: blogId }
    } = req

    const blog = await Blog.findOneAndDelete({ createdBy: _id, _id: blogId })

    if (!blog) {
        throw new Forbidden('Permission denied')
    }

    res.status(StatusCodes.OK).json({ msg: 'Deleted successfully' })
}

const shareBlog = async (req, res) => {
    const {
        body: { email },
        user: { _id },
        params: { id: blogId }
    } = req

    if (email === '') {
        throw new BadRequestError('Email field cannot be empty')
    }


    const blog = await Blog.find({ _id: blogId, createdBy: _id })

    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`)
    }

    const participant = await User.findOne({ email: email })
    if (!participant) {
        throw new NotFoundError(`User not found`)
    }

    const participantId = participant._id

    await Blog.findOneAndUpdate({ _id: blogId }, { $addToSet: { sharedWith: participantId } }, { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({ msg: 'Shared successfully' })
}

module.exports = { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog, shareBlog }