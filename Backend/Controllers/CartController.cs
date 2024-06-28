using Backend.Data;
using Backend.Dtos.Book;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {

        private ApplicationDBContext _dbContext;

        public CartController(ApplicationDBContext dBContext)
        {
            _dbContext = dBContext;
            
        }


        [HttpPost("addtocart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var userBook = await _dbContext.UserBooks
                    .FirstOrDefaultAsync(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);

                if (userBook == null)
                {
                    userBook = new UserBooks
                    {
                        UserId = request.UserId,
                        BookId = request.BookId,
                        IsInCart = true, 
                        DateAdded = DateTime.Now
                    };

                    _dbContext.UserBooks.Add(userBook);
                }
                else
                {
                    userBook.IsInCart = true;
                    _dbContext.Entry(userBook).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Book added to cart successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to add book to cart: {ex.Message}" });
            }
        }

        [HttpPost("addtowishlist")]
        public async Task<IActionResult> AddToWishList([FromBody] AddToCartRequest request)
        {
            try
            {
                var userBook = await _dbContext.UserBooks
                    .FirstOrDefaultAsync(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);

                if (userBook == null)
                {
                    userBook = new UserBooks
                    {
                        UserId = request.UserId,
                        BookId = request.BookId,
                        IsInWishlist = true,
                        DateAdded = DateTime.Now
                    };

                    _dbContext.UserBooks.Add(userBook);
                }
                else
                {
                    userBook.IsInWishlist = true;
                    _dbContext.Entry(userBook).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Book added to Wishlist successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to add book to Wishlist: {ex.Message}" });
            }
        }

        [HttpPost("MovetoCart")]
        public async Task<IActionResult> MovetoCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var userBook = await _dbContext.UserBooks
                   .FirstOrDefaultAsync(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);
                if (userBook != null)
                {
                    userBook.IsInWishlist = false;
                    userBook.IsInCart = true;
                    _dbContext.Entry(userBook).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Book Moved to Cart successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to move to cart: {ex.Message}" });
            }
        }

        [HttpPost("RemoveFromWishlist")]
        public async Task<IActionResult> RemoveFromWishlist([FromBody] AddToCartRequest request)
        {
            try
            {
                var userBook = await _dbContext.UserBooks
                   .FirstOrDefaultAsync(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);
                if (userBook != null)
                {
                    userBook.IsInWishlist = false;
                    _dbContext.Entry(userBook).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Book Removed from Cart successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to remove book from wishlist: {ex.Message}" });
            }
        }

        [HttpPost("RemoveFromCart")]
        public async Task<IActionResult> RemoveFromCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var userBook = await _dbContext.UserBooks
                   .FirstOrDefaultAsync(ub => ub.UserId == request.UserId && ub.BookId == request.BookId);
                if (userBook != null)
                {
                    userBook.IsInCart = false;
                    _dbContext.Entry(userBook).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Book Removed from Cart successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to remove book from cart: {ex.Message}" });
            }
        }

        [HttpGet("GetAllBooksFromWishlist/{userId}")]
        public async Task<IActionResult> GetAllBooksFromWishlist(string userId)
        {
            try
            {
                var userBooks = await _dbContext.UserBooks
                    .Where(ub => ub.UserId == userId && ub.IsInWishlist)
                    .ToListAsync();

                var bookIds = userBooks.Select(ub => ub.BookId).ToList();

                var books = await _dbContext.Books
                    .Where(b => bookIds.Contains(b.Id))
                    .ToListAsync();

                return Ok(new { books });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to retrieve books from wishlist: {ex.Message}" });
            }
        }

        [HttpGet("GetAllBooksFromCart/{userId}")]
        public async Task<IActionResult> GetAllBooksFromCart(string userId)
        {
            try
            {
                var userBooks = await _dbContext.UserBooks
                    .Where(ub => ub.UserId == userId && ub.IsInCart)
                    .ToListAsync(); 
                var bookIds = userBooks.Select(ub => ub.BookId).ToList();

                // Example projection for simplicity
                var books = await _dbContext.Books
                    .Where(b => bookIds.Contains(b.Id))
                    .ToListAsync();

                return Ok(new { books });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Failed to retrieve books from Cart: {ex.Message}" });
            }
        }

        [HttpGet("checkInWishlist/{userId}/{bookId}")]
        public async Task<IActionResult> CheckInWishlist(string userId, int bookId)
        {
            var userBook = await _dbContext.UserBooks
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId && ub.IsInWishlist);

            return Ok(new { isInWishlist = userBook != null });
        }

        [HttpGet("checkInCart/{userId}/{bookId}")]
        public async Task<IActionResult> CheckInCart(string userId, int bookId)
        {
            var userBook = await _dbContext.UserBooks
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId && ub.IsInCart);

            return Ok(new { isInCart = userBook != null });
        }
    }
}
