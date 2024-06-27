using Backend.Data;
using Backend.Dtos.Book;
using Backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace Backend.Controllers
{

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

        [HttpGet("{id}", Name = "GetBorrowingById")]
        public IActionResult GetById(int id)
        {
            var borrowing = _dbContext.Borrowings.Find(id);
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
                ReturnDate = DateTime.UtcNow.AddDays(14) // Example: Due date is 14 days from borrow date
            };

            _dbContext.Borrowings.Add(borrowing);
            book.CopiesAvailable--; // Decrease copies available

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
                    ReturnDate = DateTime.UtcNow.AddDays(14) // Example: Due date is 14 days from borrow date
                };

                borrowings.Add(borrowing);
                book.CopiesAvailable--; // Decrease copies available
                _dbContext.Borrowings.Add(borrowing);
            }

            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetAll), borrowings);
        }


    }
}
