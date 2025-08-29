    /// <summary>
    /// TheOddsAPI response DTOs for deserialization
    /// </summary>
    namespace PlayerBet.Api.Models.Sports.External.TheOddsAPI
    {
        public class OddsApiGame
        {
            public string Id { get; set; } = string.Empty;
            public string Sport_Key { get; set; } = string.Empty;
            public string Sport_Title { get; set; } = string.Empty;
            public DateTime Commence_Time { get; set; }
            public string Home_Team { get; set; } = string.Empty;
            public string Away_Team { get; set; } = string.Empty;
            public bool? Completed { get; set; }
            public ICollection<OddsApiBookmaker> Bookmakers { get; set; } = new List<OddsApiBookmaker>();
        }
    }