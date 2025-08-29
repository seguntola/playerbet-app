using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Betting market (e.g., h2h, spreads, totals, player_points)
    /// </summary>
    public class Market
    {
        public string Key { get; set; } = string.Empty;
        public DateTime LastUpdate { get; set; }
        public ICollection<Outcome> Outcomes { get; set; } = new List<Outcome>();
    }
}