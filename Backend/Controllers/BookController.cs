using Backend.Data;
using Backend.Dtos.Book;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize(Policy = "LoggedInPolicy")]
    [Route("api/book")]
    [ApiController]
    [EnableCors("AllowAngularApp")]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        public BookController(ApplicationDBContext context)
        {
            _dbContext = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var books = _dbContext.Books.ToList();
            Console.WriteLine("hello" + books.Count);
            return Ok(books);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var book = _dbContext.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpGet("GetBestSellers")]
        public List<Book> GetBestSellers()
        {
            return _dbContext.Books
                .OrderByDescending(b => b.AverageRating)
                .Take(10)
                .ToList();
        }

        [HttpGet("search")]
        public IActionResult SearchBooks(string query)
        {
            var results = _dbContext.Books
                .Where(b => b.Title.Contains(query) || b.Author.Contains(query))
                .ToList();
            return Ok(results);
        }


        [HttpPost]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult Create([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Book object is null");
            }

            book.CopiesAvailable = 1;
            _dbContext.Books.Add(book);
            _dbContext.SaveChanges();

            var response = new BookResponse
            {
                Id = book.Id,
                Title = book.Title
            };

            return CreatedAtAction(nameof(GetById), new { id = book.Id }, response);
        }



        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult Update([FromRoute] int id, [FromBody] Book book)
        {
            var existingBook = _dbContext.Books.Find(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.ISBN = book.ISBN;
            existingBook.Category = book.Category;
            existingBook.AverageRating = book.AverageRating;
            existingBook.CoverImage = book.CoverImage;
            existingBook.Description = book.Description;
            existingBook.PublicationDate = book.PublicationDate;
            existingBook.Publisher = book.Publisher;
            existingBook.PageCount = book.PageCount;

            _dbContext.SaveChanges();

            return Ok(existingBook);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult Delete([FromRoute] int id)
        {
            var book = _dbContext.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }

            _dbContext.Books.Remove(book);
            _dbContext.SaveChanges();

            return NoContent();
        }
        [HttpPut("return/{borrowingId}")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult MarkAsReturned(int borrowingId)
        {
            var borrowingRecord = _dbContext.Borrowings
                                            .FirstOrDefault(b => b.Id == borrowingId && b.ReturnedDate == null);

            if (borrowingRecord == null)
            {
                return NotFound("Borrowing record not found or already returned");
            }

            borrowingRecord.ReturnedDate = DateTime.UtcNow;

            var book = _dbContext.Books.Find(borrowingRecord.BookId);
            if (book != null)
            {
                book.CopiesAvailable++; // Assuming CopiesAvailable is an integer count
            }

            try
            {
                _dbContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Concurrency error occurred while updating borrowing record");
            }

            return Ok();
        }


    }
}

