using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Data;
using PlayerBet.Api.Models;
using PlayerBet.Api.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace PlayerBet.Api.Services
{
    public interface IUsersService
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User> CreateUserAsync(CreateUserDto createUserDto);
        Task<string?> ValidateUserAsync(LoginDto loginDto);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> PhoneExistsAsync(string phone);
    }

    public class UsersService : IUsersService
    {
        private readonly PlayerBetDbContext _context;
        private readonly ILogger<UsersService> _logger;

        public UsersService(PlayerBetDbContext context, ILogger<UsersService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant());
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username.ToLowerInvariant());
        }

        public async Task<User> CreateUserAsync(CreateUserDto createUserDto)
        {
            try
            {
                _logger.LogInformation("Creating user with email: {Email}", createUserDto.Email);

                // CRITICAL FIX: Convert DateTime to UTC properly
                DateTime dateOfBirthUtc;
                if (createUserDto.DateOfBirth.Kind == DateTimeKind.Unspecified)
                {
                    // Treat unspecified dates as UTC
                    dateOfBirthUtc = DateTime.SpecifyKind(createUserDto.DateOfBirth, DateTimeKind.Utc);
                }
                else
                {
                    dateOfBirthUtc = createUserDto.DateOfBirth.ToUniversalTime();
                }

                var user = new User
                {
                    FirstName = createUserDto.FirstName.Trim(),
                    LastName = createUserDto.LastName.Trim(),
                    Email = createUserDto.Email.Trim().ToLowerInvariant(),
                    PhoneNumber = createUserDto.PhoneNumber?.Trim() ?? string.Empty,
                    ReferralCode = string.IsNullOrWhiteSpace(createUserDto.ReferralCode) ? null : createUserDto.ReferralCode.Trim(),
                    DateOfBirth = dateOfBirthUtc, // ✅ Fixed: Always UTC
                    Address = createUserDto.Address?.Trim() ?? string.Empty,
                    State = createUserDto.State?.Trim() ?? string.Empty,
                    Country = createUserDto.Country?.Trim() ?? "United States",
                    Username = createUserDto.Username.Trim().ToLowerInvariant(),
                    PasswordHash = HashPassword(createUserDto.Password),
                    Balance = 1000, // Starting bonus
                    IsVerified = true, // Auto-verify for demo
                    CreatedAt = DateTime.UtcNow,  // ✅ Already UTC
                    UpdatedAt = DateTime.UtcNow   // ✅ Already UTC
                };

                _logger.LogInformation("Adding user to context with DOB: {DOB} (Kind: {Kind})", 
                    user.DateOfBirth, user.DateOfBirth.Kind);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("User created successfully with ID: {UserId}", user.Id);
                return user;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error creating user: {Email}", createUserDto.Email);
                
                var innerException = ex.InnerException?.Message ?? "";
                
                if (innerException.Contains("IX_Users_Email"))
                    throw new InvalidOperationException("Email address is already registered");
                
                if (innerException.Contains("IX_Users_Username"))
                    throw new InvalidOperationException("Username is already taken");
                
                if (innerException.Contains("IX_Users_PhoneNumber"))
                    throw new InvalidOperationException("Phone number is already registered");
                
                if (innerException.Contains("timestamp with time zone"))
                    throw new InvalidOperationException("Date format error - please try again");
                
                throw new InvalidOperationException($"Registration failed: {innerException}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating user: {Email}", createUserDto.Email);
                throw new InvalidOperationException("Registration failed - please try again");
            }
        }

        public async Task<string?> ValidateUserAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email.ToLowerInvariant());
                
                if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                {
                    return null;
                }

                return GenerateSimpleToken(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating user: {Email}", loginDto.Email);
                return null;
            }
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email.ToLowerInvariant());
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username.ToLowerInvariant());
        }

        public async Task<bool> PhoneExistsAsync(string phone)
        {
            return await _context.Users.AnyAsync(u => u.PhoneNumber == phone);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "PlayerBetSalt"));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == hash;
        }

        private string GenerateSimpleToken(User user)
        {
            var tokenData = $"{user.Id}:{user.Email}:{DateTime.UtcNow:yyyyMMddHHmmss}";
            var tokenBytes = Encoding.UTF8.GetBytes(tokenData);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}