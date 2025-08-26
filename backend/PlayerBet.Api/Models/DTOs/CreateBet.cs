using PlayerBet.Api.Models;

namespace PlayerBet.Api.DTOs
{
    public class CreateBetDto
    {
        public int UserId { get; set; }
        public BetType Type { get; set; }
        public decimal Amount { get; set; }
        public List<BetPickDto> Picks { get; set; } = new();
    }
}