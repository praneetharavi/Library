﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Account
{
    public class RegisterDto { 

    [Required]
    public string? FirstName { get; set; }

    [Required]
    public string? LastName { get; set; }

    [Required]
     public string? UserName { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    public string? Password { get; set; }

    [Required]
    public string? Role { get; set; }

    }
}
