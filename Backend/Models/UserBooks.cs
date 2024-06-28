using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserBooks
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public bool IsInWishlist { get; set; } = false;

        [Required]
        public bool IsInCart { get; set; } = false;


        public DateTime DateAdded { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("BookId")]
        public Book Book { get; set; }
    }
}
