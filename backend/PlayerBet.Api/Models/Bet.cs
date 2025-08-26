using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models
{
    public enum BetType
    {
        SmartPlay = 1,
        PerfectPick = 2
    }
    
    public enum BetStatus
    {
        Pending = 1,
        Won = 2,
        Lost = 3,
        Partially_Won = 4 // Only for Smart Play
    }

    public class Bet
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public BetType Type { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public decimal PotentialPayout { get; set; }
        
        public decimal? ActualPayout { get; set; }
        
        [Required]
        public BetStatus Status { get; set; } = BetStatus.Pending;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<BetPick> Picks { get; set; } = new List<BetPick>();
    }
}