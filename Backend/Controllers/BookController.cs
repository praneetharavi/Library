using Backend.Data;
using Backend.Dtos.Book;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
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

            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
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
            // Update other properties as needed

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

        [HttpPut("return")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult MarkAsReturned([FromBody] Borrowing borrowing)
        {
            if (borrowing == null)
            {
                return BadRequest("Borrowing object is null");
            }

            var borrowingRecord = _dbContext.Borrowings
                                            .FirstOrDefault(b => b.BookId == borrowing.BookId && b.UserId == borrowing.UserId && b.ReturnedDate == null);

            if (borrowingRecord == null)
            {
                return NotFound("Borrowing record not found or already returned");
            }

            borrowingRecord.ReturnedDate = DateTime.UtcNow;

            var book = _dbContext.Books.Find(borrowing.BookId);
            if (book != null)
            {
                book.CopiesAvailable = 1;
            }

            try
            {
                _dbContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict();
            }

            return Ok();
        }


        [HttpGet("overdue")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult GetOverdueCheckouts()
        {
            var overdueCheckouts = _dbContext.Borrowings
                .Where(b => b.ReturnDate < DateTime.UtcNow && b.ReturnedDate == null) // overdue checkouts
                .Include(b => b.User)
                .Include(b => b.Book)
                .Select(b => new CheckoutDto
                {
                    UserId = b.UserId,
                    FirstName = b.User.FirstName,
                    LastName = b.User.LastName,
                    Email = b.User.Email,
                    BookId = b.BookId,
                    BookName = b.Book.Title,
                    Author = b.Book.Author,
                    BorrowDate = b.BorrowDate,
                    ReturnDate = b.ReturnDate
                })
                .ToList();

            return Ok(overdueCheckouts);
        }
    

        [HttpGet("latest")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult GetLatestCheckouts(int count = 10)
        {
            var latestCheckouts = _dbContext.Borrowings
                .OrderByDescending(b => b.BorrowDate)
                .Take(count)
                .Include(b => b.User)
                .Include(b => b.Book)
                .Select(b => new CheckoutDto
                {
                    UserId = b.UserId,
                    FirstName = b.User.FirstName,
                    LastName = b.User.LastName,
                    Email = b.User.Email,
                    BookId = b.BookId,
                    BookName = b.Book.Title,
                    Author = b.Book.Author,
                    BorrowDate = b.BorrowDate
                })
                .ToList();

            return Ok(latestCheckouts);
        }
    }
}

