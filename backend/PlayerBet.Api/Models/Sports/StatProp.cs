using System.ComponentModel.DataAnnotations;

namespace PlayerBet.Api.Models.Sports
{
    /// <summary>
    /// Individual stat proposition
    /// </summary>
    public class StatProp
    {
        public string Type { get; set; } = string.Empty; // "Points", "Assists", "Rebounds"
        public decimal Line { get; set; }
        public decimal OverOdds { get; set; }
        public decimal UnderOdds { get; set; }
    }
}