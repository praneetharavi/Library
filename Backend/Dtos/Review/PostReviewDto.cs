using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Review
{
    public class PostReviewDto
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public String UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int Rating { get; set; }

        public string ReviewText { get; set; }
    }
}
