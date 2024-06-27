using System;
using System.Linq;
using Backend.Data;
using Backend.Models;
using Bogus;

namespace Backend.Services
{
    public class BookDataSeeder
    {
        private readonly ApplicationDBContext _context;

        public BookDataSeeder(ApplicationDBContext context)
        {
            _context = context;
        }

        public void SeedBooks(int numberOfBooks)
        {
            if (!_context.Books.Any())
            {
                var faker = new Faker<Book>()
                    .RuleFor(b => b.Title, f => f.Lorem.Sentence())
                    .RuleFor(b => b.Author, f => f.Name.FullName())
                    .RuleFor(b => b.Description, f => f.Lorem.Paragraphs(3))
                    .RuleFor(b => b.CoverImage, f => f.Image.PicsumUrl())
                    .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
                    .RuleFor(b => b.PublicationDate, f => f.Date.Past())
                    .RuleFor(b => b.Category, f => f.Random.Word())
                    .RuleFor(b => b.ISBN, f => f.Random.AlphaNumeric(13))
                    .RuleFor(b => b.PageCount, f => f.Random.Number(100, 1000))
                    .RuleFor(b => b.CopiesAvailable, f => f.Random.Number(0, 10))
                    .RuleFor(b => b.AverageRating, f => f.Random.Double(1, 5));

                var books = faker.Generate(numberOfBooks); // Generate fake books

                _context.AddRange(books);
                _context.SaveChanges();

                Console.WriteLine($"{numberOfBooks} books have been seeded.");
            }
            else
            {
                Console.WriteLine("Books already exist in the database. Skipping seed operation.");
            }
        }
    }
}
