    /// <summary>
    /// TheOddsAPI response DTOs for deserialization
    /// </summary>
    
    namespace PlayerBet.Api.Models.Sports.External.TheOddsAPI
    {
        public class OddsApiMarket
        {
            public string Key { get; set; } = string.Empty;
            public DateTime Last_Update { get; set; }
            public ICollection<OddsApiOutcome> Outcomes { get; set; } = new List<OddsApiOutcome>();
        }
    }