using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Account
{
    public class NewUserDto
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? UserName { get; set; }

        public string? Email { get; set; }

        public string? Role { get; set; }
        public string? Token { get; set; }

        public string? LibraryCardNumber { get; set; }
    }
}
