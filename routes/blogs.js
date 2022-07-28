const express = require('express')
const router = express.Router();

const {createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog} = require('../controllers/blogs')

router.route('/').post(createBlog).get(getAllBlogs)
router.route('/:id').patch(updateBlog).get(getBlog).delete(deleteBlog)

module.exports = router