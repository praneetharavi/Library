using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Book
    {
        public Book()
        {
            Reviews = new List<Review>();
        }


        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Title length can't be more than 100 characters.")]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        [StringLength(300, ErrorMessage = "Description length can't be more than 300 characters.")]
        public string Description { get; set; }

        [Required]
        public string CoverImage { get; set; }

        [Required]
        public string Publisher { get; set; }

        [Required]
        public DateTime PublicationDate { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string ISBN { get; set; }

        [Required]
        public int PageCount { get; set; }

        public int CopiesAvailable { get; set; }

        public double AverageRating { get; set; }

        public ICollection<Review> Reviews { get; set; }
    }
}
