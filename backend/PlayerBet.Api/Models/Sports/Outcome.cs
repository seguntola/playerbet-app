using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Betting outcome (Over/Under with odds and point)
    /// </summary>
    public class Outcome
    {
        public string Name { get; set; } = string.Empty; // "Over" or "Under"
        public string Description { get; set; } = string.Empty; // Player name for player props
        public decimal Price { get; set; } // Odds in decimal format
        public decimal? Point { get; set; } // Line value (e.g., 27.5 points)
    }
}