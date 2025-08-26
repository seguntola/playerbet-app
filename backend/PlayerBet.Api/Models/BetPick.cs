using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models
{
    public enum PickType
    {
        Over = 1,
        Under = 2
    }
    
    public enum PickStatus
    {
        Pending = 1,
        Won = 2,
        Lost = 3
    }

    public class BetPick
    {
        public int Id { get; set; }
        
        [Required]
        public int BetId { get; set; }
        
        [Required]
        public string GameId { get; set; } = string.Empty;
        
        [Required]
        public string TeamName { get; set; } = string.Empty;
        
        [Required]
        public string PlayerName { get; set; } = string.Empty;
        
        [Required]
        public string StatType { get; set; } = string.Empty; // "Points", "Assists", "Rebounds", etc.
        
        [Required]
        public decimal Line { get; set; } // The over/under number
        
        [Required]
        public PickType PickType { get; set; } // Over or Under
        
        [Required]
        public decimal Odds { get; set; }
        
        public decimal? ActualValue { get; set; } // The actual stat value when game finishes
        
        [Required]
        public PickStatus Status { get; set; } = PickStatus.Pending;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Bet Bet { get; set; } = null!;
    }
}