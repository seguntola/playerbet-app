using PlayerBet.Api.Models;

namespace PlayerBet.Api.DTOs
{
    public class BetPickDto
    {
        public string GameId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public string StatType { get; set; } = string.Empty;
        public decimal Line { get; set; }
        public PickType PickType { get; set; }
        public decimal Odds { get; set; }
    }
}