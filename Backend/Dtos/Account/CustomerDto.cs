using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Account
{
    public class CustomerDto
    {
       
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string? LibraryCardNumber { get; set; }

        public int? NumberOfBooksCheckedOut { get; set; }
    }
}

