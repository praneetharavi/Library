using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Description { get; set; }

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
    }
}
