using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Detailed game information with odds
    /// </summary>
    public class GameDetails : GameInfo
    {
        public ICollection<Bookmaker> Bookmakers { get; set; } = new List<Bookmaker>();
        public ICollection<PlayerProp> PlayerProps { get; set; } = new List<PlayerProp>();
    }
}