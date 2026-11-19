const express = require('express');
const router = express.Router();
const Book = require('../models/book');


router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};
        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            filter = {
                $or: [
                    { title: regex },
                    { author: regex },
                    { isbn: regex },
                    { category: regex }
                ]
            };
        }

        const books = await Book.find(filter).sort({ createdAt: -1 });
        res.json({ data: books });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) throw new Error('book not found');
        res.json({ data: book });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, category, copies } = req.body;
        const book = new Book({
            title,
            author,
            isbn,
            category,
            copies: Number(copies)
        });
        await book.save();
        res.status(201).json({ message: 'book added successfully', data: book });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { title, author, isbn, category, copies } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title,
                author,
                isbn,
                category,
                copies: Number(copies)
            },
            { new: true, runValidators: true }
        );
        if (!updatedBook) throw new Error('book not found');
        res.json({ message: 'book updated successfully', data: updatedBook });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) throw new Error('book not found');
        res.json({ message: 'book deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
