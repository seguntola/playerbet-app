using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{

    /// <summary>
    /// Simplified player prop for mobile display
    /// </summary>
    public class PlayerPropDisplay
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty; // Player initials
        public ICollection<StatProp> Stats { get; set; } = new List<StatProp>();
    }
}