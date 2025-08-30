namespace PlayerBet.Api.Configuration
{
    /// <summary>
    /// Configuration for TheOddsAPI integration
    /// </summary>
    public class TheOddsApiConfiguration
    {
        public const string SectionName = "TheOddsAPI";

        public string ApiKey { get; set; } = "a8c3444b0a9ed272a78b13a23b8ec961";
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
            // Soccer
            "soccer_epl",                    // English Premier League
            "soccer_usa_mls",               // Major League Soccer
            "soccer_brazil_campeonato",     // Brazil Série A
            "soccer_australia_aleague",     // A-League
            
            // Basketball
            "basketball_nba",               // NBA
            "basketball_ncaab",             // NCAA Basketball (if available)
            
            // American Football
            "americanfootball_nfl",         // NFL
            "americanfootball_ncaaf",       // NCAA Football
            
            // Baseball
            "baseball_mlb",                 // MLB
            
            // Ice Hockey
            "icehockey_nhl",               // NHL
            
            // Tennis
            "tennis_atp_french_open",      // ATP Tennis
            "tennis_wta_french_open",      // WTA Tennis
            
            // Cricket
            "cricket_test_match",          // International Test Matches
            
            // Other Sports
            "aussierules_afl",             // Australian Football League
            "rugbyleague_nrl",             // National Rugby League
            "mma_mixed_martial_arts",      // Mixed Martial Arts
        };

        // Default bookmakers to fetch from
        public List<string> PreferredBookmakers { get; set; } = new()
        {
            "draftkings",
            "fanduel",
            "betmgm",
            "pointsbet"
        };

        /// <summary>
        /// Configuration for how a sport should be displayed in the UI
        /// </summary>
        public class SportDisplayConfig
        {
            public string Label { get; set; } = string.Empty;
            public string Icon { get; set; } = string.Empty;
            public string Group { get; set; } = string.Empty;
            public bool Priority { get; set; } = false; // For featured sports
        }
        
        // UPDATED: Sport display configuration with icons
        public Dictionary<string, SportDisplayConfig> SportDisplayConfigs { get; set; } = new()
        {
            // Soccer
            { "soccer_epl", new SportDisplayConfig { Label = "Premier League", Icon = "football-outline", Group = "Soccer" } },
            { "soccer_usa_mls", new SportDisplayConfig { Label = "MLS", Icon = "football-outline", Group = "Soccer" } },
            { "soccer_brazil_campeonato", new SportDisplayConfig { Label = "Brazil Série A", Icon = "football-outline", Group = "Soccer" } },
            { "soccer_australia_aleague", new SportDisplayConfig { Label = "A-League", Icon = "football-outline", Group = "Soccer" } },
            
            // Basketball
            { "basketball_nba", new SportDisplayConfig { Label = "NBA", Icon = "basketball-outline", Group = "Basketball" } },
            { "basketball_ncaab", new SportDisplayConfig { Label = "NCAA Basketball", Icon = "basketball-outline", Group = "Basketball" } },
            
            // American Football
            { "americanfootball_nfl", new SportDisplayConfig { Label = "NFL", Icon = "american-football-outline", Group = "American Football" } },
            { "americanfootball_ncaaf", new SportDisplayConfig { Label = "NCAA Football", Icon = "american-football-outline", Group = "American Football" } },
            
            // Baseball
            { "baseball_mlb", new SportDisplayConfig { Label = "MLB", Icon = "baseball-outline", Group = "Baseball" } },
            
            // Ice Hockey
            { "icehockey_nhl", new SportDisplayConfig { Label = "NHL", Icon = "snow-outline", Group = "Ice Hockey" } },
            
            // Tennis
            { "tennis_atp_french_open", new SportDisplayConfig { Label = "ATP Tennis", Icon = "tennisball-outline", Group = "Tennis" } },
            { "tennis_wta_french_open", new SportDisplayConfig { Label = "WTA Tennis", Icon = "tennisball-outline", Group = "Tennis" } },
            
            // Cricket
            { "cricket_test_match", new SportDisplayConfig { Label = "Cricket", Icon = "baseball-outline", Group = "Cricket" } },
            
            // Other Sports
            { "aussierules_afl", new SportDisplayConfig { Label = "AFL", Icon = "american-football-outline", Group = "Australian Football" } },
            { "rugbyleague_nrl", new SportDisplayConfig { Label = "NRL", Icon = "american-football-outline", Group = "Rugby" } },
            { "mma_mixed_martial_arts", new SportDisplayConfig { Label = "MMA", Icon = "fitness-outline", Group = "Combat Sports" } },
        };
    }
}