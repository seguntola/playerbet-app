using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Represents basic sport information from TheOddsAPI
    /// </summary>
    public class SportInfo
    {
        public string Key { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Group { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Active { get; set; }
        public bool HasOutrights { get; set; }
    }
}