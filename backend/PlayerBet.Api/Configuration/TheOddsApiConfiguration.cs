namespace PlayerBet.Api.Configuration
{
    /// <summary>
    /// Configuration for TheOddsAPI integration
    /// </summary>
    public class TheOddsApiConfiguration
    {
        public const string SectionName = "TheOddsAPI";

        public string ApiKey { get; set; } = "c3447fc9a880a313dd180c42264ea244";
        public string BaseUrl { get; set; } = "https://api.the-odds-api.com";
        public int TimeoutSeconds { get; set; } = 30;
        public bool UseCache { get; set; } = true;
        public int DefaultCacheMinutes { get; set; } = 15;
        public int MaxRetries { get; set; } = 3;
        public int RetryDelaySeconds { get; set; } = 5;
        
        // Rate limiting
        public int MaxRequestsPerMinute { get; set; } = 30;
        public int MaxRequestsPerHour { get; set; } = 1000;
        
        // Supported sports configuration
        public List<string> SupportedSports { get; set; } = new()
        {
            "basketball_nba",
            "americanfootball_nfl", 
            "soccer_epl"
        };
        
        // Default bookmakers to fetch from
        public List<string> PreferredBookmakers { get; set; } = new()
        {
            "draftkings",
            "fanduel", 
            "betmgm",
            "pointsbet"
        };
    }
}