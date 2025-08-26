namespace PlayerBet.Api.DTOs
{
    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ReferralCode { get; set; }
        
        // Custom DateTime handling for PostgreSQL
        private DateTime _dateOfBirth;
        public DateTime DateOfBirth 
        { 
            get => _dateOfBirth;
            set => _dateOfBirth = value.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
        }
        
        public string Address { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}