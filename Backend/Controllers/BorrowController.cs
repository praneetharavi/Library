using Backend.Data;
using Backend.Dtos.Book;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace Backend.Controllers
{

    [Authorize(Policy = "LoggedInPolicy")]
    [Route("api/Borrow")]
    [ApiController]
    [EnableCors("AllowAngularApp")]
    public class BorrowController : ControllerBase
    {

        private readonly ApplicationDBContext _dbContext;
        public BorrowController(ApplicationDBContext context)
        {
            _dbContext = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var borrowing = _dbContext.Borrowings
                .Where(b => b.Id == id)
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
                    ReturnDate = b.ReturnDate,
                    CoverImage = b.Book.CoverImage
                })
                .FirstOrDefault();

            if (borrowing == null)
            {
                return NotFound();
            }
            return Ok(borrowing);
        }

        [HttpGet("borrowings")]
        public IActionResult GetAll()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var borrowings = _dbContext.Borrowings
                .Where(b => b.UserId == userId)
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
                    ReturnDate = b.ReturnDate,
                    CoverImage = b.Book.CoverImage
                })
                .ToList();

            return Ok(borrowings);
        }

        [HttpGet("getAllCheckoutsbyUserId/{userId}")]
        public IActionResult GetByUserId(string userId)
        {
            var borrowings = _dbContext.Borrowings
                .Where(b => b.UserId == userId)
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
                    ReturnDate = b.ReturnDate,
                    CoverImage = b.Book.CoverImage
                })
                .ToList();

            return Ok(borrowings);
        }

        [HttpGet("GetBorrowingsByBookId/{bookId}")]
        public IActionResult GetByBookId(int bookId)
        {
            var borrowings = _dbContext.Borrowings
                .Where(b => b.BookId == bookId)
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
                    ReturnDate = b.ReturnDate,
                    CoverImage = b.Book.CoverImage
                })
                .ToList();

            return Ok(borrowings);
        }


        [HttpPost("checkout")]
        public IActionResult Checkout([FromBody] CheckoutRequestDto request)
        {
            if (request == null)
            {
                return BadRequest("Checkout request is null");
            }

            var book = _dbContext.Books.Find(request.BookId);
            if (book == null)
            {
                return NotFound("Book not found");
            }

            if (book.CopiesAvailable <= 0)
            {
                return BadRequest("No copies of the book available for checkout");
            }

            var borrowing = new Borrowing
            {
                UserId = request.UserId,
                BookId = request.BookId,
                BorrowDate = DateTime.UtcNow,
                ReturnDate = DateTime.UtcNow.AddDays(5) 
            };

            _dbContext.Borrowings.Add(borrowing);
            book.CopiesAvailable--; // Decrease copies available

            var userBook = _dbContext.UserBooks.FirstOrDefault(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);
            if (userBook != null)
            {
                userBook.IsInCart = false;
            }

            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = borrowing.Id }, borrowing);
        }

        [HttpPost("checkout/multiple")]
        public IActionResult CheckoutMultiple([FromBody] MultipleCheckoutRequestDto request)
        {
            if (request == null || request.BookIds == null || request.BookIds.Count == 0)
            {
                return BadRequest("Invalid checkout request");
            }

            var books = _dbContext.Books.Where(b => request.BookIds.Contains(b.Id)).ToList();
            if (books == null || books.Count != request.BookIds.Count)
            {
                return NotFound("One or more books not found");
            }

            foreach (var book in books)
            {
                if (book.CopiesAvailable <= 0)
                {
                    return BadRequest($"No copies available for book '{book.Title}'");
                }
            }

            var borrowings = new List<Borrowing>();

            foreach (var book in books)
            {
                var borrowing = new Borrowing
                {
                    UserId = request.UserId,
                    BookId = book.Id,
                    BorrowDate = DateTime.UtcNow,
                    ReturnDate = DateTime.UtcNow.AddDays(5) 
                };

                borrowings.Add(borrowing);
                book.CopiesAvailable--;

                var userBook = _dbContext.UserBooks.FirstOrDefault(ub => ub.UserId == request.UserId && ub.BookId == book.Id);
                if (userBook != null)
                {
                    userBook.IsInCart = false;
                }

                _dbContext.Borrowings.Add(borrowing);
            }

            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetAll), borrowings);
        }

        [HttpGet("overdueCheckouts")]
        [Authorize(Roles = Roles.Librarian)]
        public IActionResult GetOverdueCheckouts(int count = 10)
        {
            var overdueCheckouts = _dbContext.Borrowings
                .Where(b => b.ReturnDate < DateTime.UtcNow && b.ReturnedDate == null)
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
                    BorrowDate = b.BorrowDate,
                    ReturnDate = b.ReturnDate,
                    CoverImage = b.Book.CoverImage,
                    ReturnedDate = b.ReturnedDate,
                    BorrowingId = b.Id
                })
                .ToList();

            return Ok(overdueCheckouts);
        }


        [HttpGet("latestCheckouts")]
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
                    BorrowDate = b.BorrowDate,
                    ReturnDate= b.ReturnDate,
                    CoverImage = b.Book.CoverImage,
                    ReturnedDate = b.ReturnedDate,
                    BorrowingId = b.Id
                })
                .ToList();

            return Ok(latestCheckouts);
        }

    }
}
