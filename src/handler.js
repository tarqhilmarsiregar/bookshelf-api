const { nanoid } = require("nanoid")
const books = require('./books')

const addBookHandler = (req, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload

    const id = nanoid(16)

    const finished = pageCount === readPage ? true : false

    const insertedAt = new Date().toISOString()

    const updatedAt = insertedAt
    
    if(!req.payload.name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt}
    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }
}

const getAllBooksHandler = (req, h) => {
    const { name } = req.query

    const result = books.map(({ id, name, publisher}) => ({ id, name, publisher }))

    if(!req.query.name && !req.query.reading) {
        const response = h.response({
            status: "success",
            data: { books: result}
        })
        response.code(200)
        return response
    }

    if(books.length > 0) {
        const filterBookByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
        
        const bookByName = filterBookByName.map(({ id, name, publisher}) => ({ id, name, publisher }))

        if(filterBookByName) {
            const response = h.response({
                status: "success",
                data: { books: bookByName }
            })
            response.code(200)
            return response
        }
    }

}


const getDetailBookHandler = (req, h) => {
    const { bookId } = req.params
    
    const book = books.find((book) => book.id === bookId)

    if(book) {
        const response = h.response({
            status: "success",
            data: { book }
        })
        response.code(200)
        return response

    } else {
        const response = h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        })
        response.code(404)
        return response
    }
    
}

const editBookByIdHandler = (req, h) => {
    const { bookId } = req.params

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload

    const updatedAt = new Date().toISOString()

    const idx = books.findIndex((book) => book.id === bookId)

    const book = books.find((book) => book.id === bookId)

    if(!book) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        })
        response.code(404)
        return response
    }
    
    if(!req.payload.name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    if(idx !== -1) {
        books[idx] = {
            ...books[idx],name, year, author, summary, publisher, pageCount, readPage, reading,
            updatedAt
        }
    }

    const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui"
    })
    response.code(200)
    return response
}

const deleteBookByIdHandler = (req, h) => {
    const { bookId } = req.params

    const book = books.find((book) => book.id === bookId)

    const idx = books.findIndex((book) => book.id === bookId)

    if(!book) {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        })
        response.code(404)
        return response
    }

    if(idx !== -1) {
        books.splice(idx, 1)
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        })
        response.code(200)
        return response
    }
}

module.exports = { addBookHandler, getAllBooksHandler, getDetailBookHandler, editBookByIdHandler, deleteBookByIdHandler }