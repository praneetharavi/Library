using Backend.Data;
using Backend.Dtos.Account;
using Backend.Interfaces;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    [EnableCors("AllowAngularApp")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly RoleManager<IdentityRole> _roleManager;
        private HashSet<string> _generatedCardNumbers = new HashSet<string>();
        private readonly ApplicationDBContext _dbContext;


        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager,ITokenService 
            tokenService, RoleManager<IdentityRole> roleManager,ApplicationDBContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
            _dbContext = dbContext;
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Email not Found" });
            }
            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                return Ok(new
                {
                    message = "Login successful",
                    role = roles.FirstOrDefault(),
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    userName = user.UserName,
                    token = _tokenService.CreateToken(user)
                });
            }

            return Unauthorized(new { message = "Email not Found and/or Password incorrect" });
      

        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);



                var appUser = new User
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Role = registerDto.Role,
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    if (!await _roleManager.RoleExistsAsync(registerDto.Role))
                    {
                        // If the role doesn't exist, create it
                        await _roleManager.CreateAsync(new IdentityRole(registerDto.Role));
                    }

                    await _userManager.AddToRoleAsync(appUser, registerDto.Role);

                    // Generate library card number if role is "Customer"
                    if (registerDto.Role == Roles.Customer)
                    {
                        appUser.LibraryCardNumber = GenerateLibraryCardNumber(appUser.FirstName, appUser.LastName);
                    }

                    var result = await _userManager.UpdateAsync(appUser);

                    if (result.Succeeded)
                    {
                        return Ok(new NewUserDto
                        {
                            FirstName = appUser.FirstName,
                            LastName = appUser.LastName,
                            Email = appUser.Email,
                            Role = registerDto.Role,
                            UserName = appUser.UserName,
                            LibraryCardNumber = appUser.LibraryCardNumber,
                            Token = _tokenService.CreateToken(appUser)
                        });
                    }
                    else
                    {
                        return StatusCode(500, result.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private string GenerateLibraryCardNumber(string firstName, string lastName)
        {
            var rand = new Random();
            var firstNameParts = firstName.Split(' ');
            var lastNameParts = lastName.Split(' ');

            var firstWordFirstName = firstNameParts.Length > 0 ? firstNameParts[0] : "";
            var firstWordLastName = lastNameParts.Length > 0 ? lastNameParts[0] : "";

            string generatedNumber;
            do
            {
                var randomNumber = rand.Next(10000, 99999); // 5 random digits
                generatedNumber = $"{firstWordFirstName.ToUpper()[0]}{firstWordLastName.ToUpper()[0]}{randomNumber}";
            } while (_generatedCardNumbers.Contains(generatedNumber) || _userManager.Users.Any(u => u.LibraryCardNumber == generatedNumber));

            _generatedCardNumbers.Add(generatedNumber);

            return generatedNumber;
        }


       
        [HttpGet("getAllCustomers")]
        [Authorize(Roles = Roles.Librarian)]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _userManager.GetUsersInRoleAsync(Roles.Customer);

            var customerDtos = new List<CustomerDto>();

            foreach (var user in customers)
            {
                var borrowedBooksCount = await _dbContext.Borrowings
                    .Where(b => b.UserId == user.Id && b.ReturnedDate == null)
                    .CountAsync();

                var customerDto = new CustomerDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    LibraryCardNumber = user.LibraryCardNumber,
                    NumberOfBooksCheckedOut = borrowedBooksCount
                };

                customerDtos.Add(customerDto);
            }

            return Ok(customerDtos);
        }
    }
}
