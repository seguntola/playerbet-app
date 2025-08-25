using Microsoft.AspNetCore.Mvc;
using PlayerBet.Api.Services;
using PlayerBet.Api.DTOs;
using PlayerBet.Api.Models;

namespace PlayerBet.Api.Controllers
{
[ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUsersService usersService, ILogger<UsersController> logger)
        {
            _usersService = usersService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                _logger.LogInformation("📥 Registration request received");
                
                // Basic null check
                if (createUserDto == null)
                {
                    return BadRequest(new { message = "Request data is required" });
                }

                _logger.LogInformation("📥 Request data: {@CreateUserDto}", new {
                    FirstName = createUserDto.FirstName,
                    LastName = createUserDto.LastName,
                    Email = createUserDto.Email,
                    PhoneNumber = createUserDto.PhoneNumber,
                    ReferralCode = createUserDto.ReferralCode,
                    DateOfBirth = createUserDto.DateOfBirth,
                    Address = createUserDto.Address,
                    State = createUserDto.State,
                    Country = createUserDto.Country,
                    Username = createUserDto.Username,
                    Password = "[HIDDEN]"
                });

                // Validation
                if (await _usersService.EmailExistsAsync(createUserDto.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                if (await _usersService.UsernameExistsAsync(createUserDto.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                if (await _usersService.PhoneExistsAsync(createUserDto.PhoneNumber))
                {
                    return BadRequest(new { message = "Phone number already exists" });
                }

                // Age validation
                var age = DateTime.Today.Year - createUserDto.DateOfBirth.Year;
                if (createUserDto.DateOfBirth.Date > DateTime.Today.AddYears(-age)) age--;
                
                if (age < 21)
                {
                    return BadRequest(new { message = "You must be 21 or older to register" });
                }

                var user = await _usersService.CreateUserAsync(createUserDto);

                return Ok(new
                {
                    message = "User registered successfully",
                    user = new
                    {
                        id = user.Id,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        username = user.Username,
                        balance = user.Balance,
                        name = $"{user.FirstName} {user.LastName}"
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var token = await _usersService.ValidateUserAsync(loginDto);
                
                if (token == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var user = await _usersService.GetUserByEmailAsync(loginDto.Email);
                
                return Ok(new
                {
                    message = "Login successful",
                    token = token,
                    user = new
                    {
                        id = user!.Id,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        username = user.Username,
                        balance = user.Balance,
                        name = $"{user.FirstName} {user.LastName}"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpPost("check-availability")]
        public async Task<IActionResult> CheckAvailability([FromBody] CheckAvailabilityDto dto)
        {
            try
            {
                var result = new
                {
                    emailExists = !string.IsNullOrEmpty(dto.Email) && await _usersService.EmailExistsAsync(dto.Email),
                    usernameExists = !string.IsNullOrEmpty(dto.Username) && await _usersService.UsernameExistsAsync(dto.Username),
                    phoneExists = !string.IsNullOrEmpty(dto.PhoneNumber) && await _usersService.PhoneExistsAsync(dto.PhoneNumber)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        // ✅ FIX: Put parameterized routes AFTER specific routes
        // Added route constraint to ensure id is actually an integer
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _usersService.GetUserByIdAsync(id);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    username = user.Username,
                    balance = user.Balance,
                    phoneNumber = user.PhoneNumber,
                    dateOfBirth = user.DateOfBirth,
                    address = user.Address,
                    state = user.State,
                    country = user.Country,
                    isVerified = user.IsVerified,
                    createdAt = user.CreatedAt,
                    name = $"{user.FirstName} {user.LastName}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }

    public class CheckAvailabilityDto
    {
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? PhoneNumber { get; set; }
    }
}