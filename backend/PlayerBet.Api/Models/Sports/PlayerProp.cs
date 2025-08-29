using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Player proposition bet
    /// </summary>
    public class PlayerProp
    {
        public string Id { get; set; } = string.Empty;
        public string GameId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public string StatType { get; set; } = string.Empty; // Points, Assists, Rebounds, etc.
        public decimal Line { get; set; } // The over/under number
        public decimal OverOdds { get; set; } // Decimal odds for over
        public decimal UnderOdds { get; set; } // Decimal odds for under
        public DateTime LastUpdate { get; set; }
        public string BookmakerKey { get; set; } = string.Empty;
        public string BookmakerTitle { get; set; } = string.Empty;
        
        // Additional metadata for mobile display
        public ICollection<decimal> RecentForm { get; set; } = new List<decimal>(); // Last 5 games performance
        public string Position { get; set; } = string.Empty; // Player position
        public string Avatar { get; set; } = string.Empty; // Player initials for mobile
    }
}