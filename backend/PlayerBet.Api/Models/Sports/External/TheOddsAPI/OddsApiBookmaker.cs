    /// <summary>
    /// TheOddsAPI response DTOs for deserialization
    /// </summary>
    namespace PlayerBet.Api.Models.Sports.External.TheOddsAPI
    {

        public class OddsApiBookmaker
        {
            public string Key { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public DateTime Last_Update { get; set; }
            public ICollection<OddsApiMarket> Markets { get; set; } = new List<OddsApiMarket>();
        }
    }