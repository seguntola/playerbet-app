using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Game with simplified player props for mobile display
    /// </summary>
    public class GameWithProps
    {
        public string Id { get; set; } = string.Empty;
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public DateTime GameTime { get; set; }
        public string Status { get; set; } = string.Empty; // "Upcoming", "Live", "Completed"
        public ICollection<PlayerPropDisplay> Players { get; set; } = new List<PlayerPropDisplay>();
    }
}