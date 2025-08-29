    /// <summary>
    /// TheOddsAPI response DTOs for deserialization
    /// </summary>
    namespace PlayerBet.Api.Models.Sports.External.TheOddsAPI
    {
        public class OddsApiSport
        {
            public string Key { get; set; } = string.Empty;
            public string Group { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public bool Active { get; set; }
            public bool Has_Outrights { get; set; }
        }
    }