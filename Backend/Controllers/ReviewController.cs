﻿using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using Backend.Dtos.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace Backend.Controllers
{
    [Authorize(Policy = "LoggedInPolicy")]
    [EnableCors("AllowAngularApp")]
    [Route("api/reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ReviewController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateReview([FromBody] PostReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == reviewDto.UserId);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var book = _context.Books
                                .FirstOrDefault(b => b.Id == reviewDto.BookId);
            if (book == null)
            {
                return BadRequest("Book not found");
            }

            var review = new Review
            {
                UserId = reviewDto.UserId,
                User = user,
                BookId = reviewDto.BookId,
                Book = book,
                Rating = reviewDto.Rating,
                ReviewText = reviewDto.ReviewText
            };

            _context.Reviews.Add(review);

            try
            {
                _context.SaveChanges();
                var reviewsForBook = _context.Reviews.Where(r => r.BookId == reviewDto.BookId).ToList();
                if (reviewsForBook.Any())
                {

                    book.AverageRating = reviewsForBook.Average(r => r.Rating);
                    _context.Books.Update(book);
                    _context.SaveChanges();
                }
                else
                {
                    book.AverageRating = reviewDto.Rating;
                    _context.Books.Update(book);
                    _context.SaveChanges();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Concurrency error occurred while saving review");
            }

            return Ok(review);
        }


        [HttpGet("book/{bookId}")]
        public IActionResult GetReviewsByBookId(int bookId)
        {
            var reviews = _context.Reviews
                                  .Where(r => r.BookId == bookId)
                                  .Select(r => new GetReviewDto
                                  {
                                      Id = r.Id,
                                      UserId = r.UserId,
                                      Username = r.User.UserName, // Assuming UserName is the field for username
                                      BookId = r.BookId,
                                      Rating = r.Rating,
                                      ReviewText = r.ReviewText
                                  })
                                  .ToList();

            return Ok(reviews);
        }

    }
}
