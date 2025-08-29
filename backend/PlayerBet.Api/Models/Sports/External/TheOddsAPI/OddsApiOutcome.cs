    /// <summary>
    /// TheOddsAPI response DTOs for deserialization
    /// </summary>
    namespace PlayerBet.Api.Models.Sports.External.TheOddsAPI
    {
        public class OddsApiOutcome
        {
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; } // Player name for player props
            public decimal Price { get; set; }
            public decimal? Point { get; set; }
        }
    }