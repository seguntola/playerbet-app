using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Bookmaker information and odds
    /// </summary>
    public class Bookmaker
    {
        public string Key { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime LastUpdate { get; set; }
        public ICollection<Market> Markets { get; set; } = new List<Market>();
    }
}