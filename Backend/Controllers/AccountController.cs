using Backend.Dtos.Account;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using System.Data;

namespace Backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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
                    lastName = user.LastName
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
                    Role = registerDto.Role
                };
                var createdUser = await _userManager.CreateAsync(appUser,registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, registerDto.Role);
                    if (roleResult.Succeeded)
                    {
                        return Ok("User Created");
                    }
                    else
                    {
                        return StatusCode(500,roleResult.Errors);
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


    }
}
