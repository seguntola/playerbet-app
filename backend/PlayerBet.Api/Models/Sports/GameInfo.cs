using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Basic game information
    /// </summary>
    public class GameInfo
    {
        public string Id { get; set; } = string.Empty;
        public string SportKey { get; set; } = string.Empty;
        public string SportTitle { get; set; } = string.Empty;
        public DateTime CommenceTime { get; set; }
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public bool IsLive { get; set; }
    }
}