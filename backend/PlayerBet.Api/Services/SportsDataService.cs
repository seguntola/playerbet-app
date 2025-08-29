using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Models.Sports;
using System.Text.Json;
using PlayerBet.Api.Configuration;
using PlayerBet.Api.Models.Sports.External.TheOddsAPI;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

namespace PlayerBet.Api.Services
{
    /// <summary>
    /// Service interface for fetching real-time sports data from TheOddsAPI
    /// </summary>
    public interface ISportsDataService
    {
        /// <summary>
        /// Get all available sports from TheOddsAPI
        /// </summary>
        Task<IEnumerable<SportInfo>> GetAvailableSportsAsync();

        /// <summary>
        /// Get upcoming games for a specific sport
        /// </summary>
        Task<IEnumerable<GameInfo>> GetUpcomingGamesAsync(string sportKey, int daysAhead = 7);

        /// <summary>
        /// Get detailed odds and player props for a specific game
        /// </summary>
        Task<GameDetails> GetGameDetailsAsync(string sportKey, string gameId);

        /// <summary>
        /// Get player props for a specific game
        /// </summary>
        Task<IEnumerable<PlayerProp>> GetPlayerPropsAsync(string sportKey, string gameId, 
            IEnumerable<string>? markets = null);

        /// <summary>
        /// Get games with basic information (for initial mobile display)
        /// </summary>
        Task<IEnumerable<GameWithProps>> GetGamesWithPropsAsync(string sportKey, int maxGames = 10);

        /// <summary>
        /// Health check for the sports data API
        /// </summary>
        Task<bool> IsApiHealthyAsync();
    }

    public class SportsDataService : ISportsDataService
    {
        private readonly HttpClient _httpClient;
        private readonly TheOddsApiConfiguration _config;
        private readonly ILogger<SportsDataService> _logger;
        private readonly ICacheService _cacheService;
        private readonly JsonSerializerOptions _jsonOptions;

        // Player names mapping for generating avatars
        private static readonly Dictionary<string, string> PlayerAvatarMap = new()
        {
            { "LeBron James", "LJ" },
            { "Stephen Curry", "SC" },
            { "Kevin Durant", "KD" },
            { "Giannis Antetokounmpo", "GA" },
            { "Luka Doncic", "LD" },
            { "Anthony Davis", "AD" },
            { "Jayson Tatum", "JT" },
            { "Nikola Jokic", "NJ" },
            { "Joel Embiid", "JE" },
            { "Jimmy Butler", "JB" },
            { "Damian Lillard", "DL" },
            { "Kawhi Leonard", "KL" },
            { "Paul George", "PG" },
            { "Russell Westbrook", "RW" },
            { "Chris Paul", "CP" },
            { "Klay Thompson", "KT" },
            { "Draymond Green", "DG" },
            { "Kyrie Irving", "KI" },
            { "James Harden", "JH" },
            { "Devin Booker", "DB" },
            // Football players
            { "Patrick Mahomes", "PM" },
            { "Josh Allen", "JA" },
            { "Aaron Rodgers", "AR" },
            { "Tom Brady", "TB" },
            { "Lamar Jackson", "LJ" },
            { "Justin Herbert", "JH" },
            { "Joe Burrow", "JB" },
            { "Dak Prescott", "DP" },
            { "Russell Wilson", "RW" },
            { "Tua Tagovailoa", "TT" },
            { "Derrick Henry", "DH" },
            { "Christian McCaffrey", "CM" },
            { "Dalvin Cook", "DC" },
            { "Ezekiel Elliott", "EE" },
            { "Alvin Kamara", "AK" },
            { "Travis Kelce", "TK" },
            { "Davante Adams", "DA" },
            { "Tyreek Hill", "TH" },
            { "DeAndre Hopkins", "DH" },
            { "Stefon Diggs", "SD" },
            // Soccer players  
            { "Erling Haaland", "EH" },
            { "Mohamed Salah", "MS" },
            { "Kevin De Bruyne", "KB" },
            { "Bukayo Saka", "BS" },
            { "Cole Palmer", "CP" },
            { "Martin Ødegaard", "MØ" },
            { "Marcus Rashford", "MR" },
            { "Bruno Fernandes", "BF" },
            { "Virgil van Dijk", "VD" },
            { "Sadio Mane", "SM" }
        };

        public SportsDataService(
            HttpClient httpClient, 
            IOptions<TheOddsApiConfiguration> config, 
            ILogger<SportsDataService> logger,
            ICacheService cacheService)
        {
            _httpClient = httpClient;
            _config = config.Value;
            _logger = logger;
            _cacheService = cacheService;
            
            // Configure JSON options for TheOddsAPI response format
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            // Configure HttpClient
            _httpClient.BaseAddress = new Uri(_config.BaseUrl);
            _httpClient.Timeout = TimeSpan.FromSeconds(_config.TimeoutSeconds);
        }

        public async Task<IEnumerable<SportInfo>> GetAvailableSportsAsync()
        {
            const string cacheKey = "sports_available";
            
            try
            {
                // Try to get from cache first
                var cachedSports = await _cacheService.GetAsync<IEnumerable<SportInfo>>(cacheKey);
                if (cachedSports != null)
                {
                    return cachedSports;
                }

                var url = $"/v4/sports/?apiKey={_config.ApiKey}";
                _logger.LogInformation("Fetching available sports from TheOddsAPI");

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var oddsApiSports = JsonSerializer.Deserialize<List<OddsApiSport>>(content, _jsonOptions);

                var sports = oddsApiSports?
                    .Where(s => s.Active && IsSupportedSport(s.Key))
                    .Select(MapToSportInfo)
                    .ToList() ?? new List<SportInfo>();

                // Cache for 1 hour
                await _cacheService.SetAsync(cacheKey, sports, TimeSpan.FromHours(1));

                _logger.LogInformation($"Successfully fetched {sports.Count} available sports");
                return sports;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available sports from TheOddsAPI");
                return new List<SportInfo>();
            }
        }

        public async Task<IEnumerable<GameInfo>> GetUpcomingGamesAsync(string sportKey, int daysAhead = 7)
        {
            var cacheKey = $"games_upcoming_{sportKey}_{daysAhead}";
            
            try
            {
                // Try cache first
                var cachedGames = await _cacheService.GetAsync<IEnumerable<GameInfo>>(cacheKey);
                if (cachedGames != null)
                {
                    return cachedGames;
                }

                var url = $"/v4/sports/{sportKey}/odds?apiKey={_config.ApiKey}&regions=us&markets=h2h&oddsFormat=decimal";
                _logger.LogInformation($"Fetching upcoming games for {sportKey}");

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var oddsApiGames = JsonSerializer.Deserialize<List<OddsApiGame>>(content, _jsonOptions);

                var games = oddsApiGames?
                    .Where(g => g.Commence_Time > DateTime.UtcNow && g.Commence_Time <= DateTime.UtcNow.AddDays(daysAhead))
                    .Select(MapToGameInfo)
                    .ToList() ?? new List<GameInfo>();

                // Cache for 15 minutes
                await _cacheService.SetAsync(cacheKey, games, TimeSpan.FromMinutes(15));

                _logger.LogInformation($"Successfully fetched {games.Count} upcoming games for {sportKey}");
                return games;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching upcoming games for {sportKey}");
                return new List<GameInfo>();
            }
        }

        public async Task<GameDetails> GetGameDetailsAsync(string sportKey, string gameId)
        {
            var cacheKey = $"game_details_{sportKey}_{gameId}";
            
            try
            {
                // Try cache first
                var cachedDetails = await _cacheService.GetAsync<GameDetails>(cacheKey);
                if (cachedDetails != null)
                {
                    return cachedDetails;
                }

                var markets = GetPlayerPropsMarkets(sportKey);
                var marketsParam = string.Join(",", markets.Concat(new[] { "h2h", "spreads", "totals" }));
                
                var url = $"/v4/sports/{sportKey}/events/{gameId}/odds?apiKey={_config.ApiKey}&regions=us&markets={marketsParam}&oddsFormat=decimal";
                _logger.LogInformation($"Fetching game details for {gameId} in {sportKey}");

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var oddsApiGame = JsonSerializer.Deserialize<OddsApiGameDetails>(content, _jsonOptions);

                if (oddsApiGame == null)
                {
                    throw new InvalidOperationException($"No game data found for {gameId}");
                }

                var gameDetails = MapToGameDetails(oddsApiGame);
                
                // Extract player props
                gameDetails.PlayerProps = ExtractPlayerProps(oddsApiGame, sportKey);

                // Cache for 5 minutes
                await _cacheService.SetAsync(cacheKey, gameDetails, TimeSpan.FromMinutes(5));

                _logger.LogInformation($"Successfully fetched game details for {gameId}");
                return gameDetails;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching game details for {gameId}");
                throw;
            }
        }

        public async Task<IEnumerable<PlayerProp>> GetPlayerPropsAsync(string sportKey, string gameId, 
            IEnumerable<string>? markets = null)
        {
            try
            {
                var gameDetails = await GetGameDetailsAsync(sportKey, gameId);
                var playerProps = gameDetails.PlayerProps;

                if (markets != null && markets.Any())
                {
                    var marketsList = markets.ToList();
                    playerProps = playerProps.Where(pp => marketsList.Contains(pp.StatType.ToLowerInvariant())).ToList();
                }

                return playerProps;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching player props for game {gameId}");
                return new List<PlayerProp>();
            }
        }

        public async Task<IEnumerable<GameWithProps>> GetGamesWithPropsAsync(string sportKey, int maxGames = 10)
        {
            var cacheKey = $"games_with_props_{sportKey}_{maxGames}";
            
            try
            {
                // Try cache first (cached for 10 minutes)
                var cachedGames = await _cacheService.GetAsync<IEnumerable<GameWithProps>>(cacheKey);
                if (cachedGames != null)
                {
                    return cachedGames;
                }

                _logger.LogInformation($"Building games with props for {sportKey}");
                
                // Get upcoming games
                var upcomingGames = (await GetUpcomingGamesAsync(sportKey))
                    .Take(maxGames)
                    .ToList();

                var gamesWithProps = new List<GameWithProps>();

                // Process each game to get player props
                foreach (var game in upcomingGames)
                {
                    try
                    {
                        var gameDetails = await GetGameDetailsAsync(sportKey, game.Id);
                        var gameWithProps = MapToGameWithProps(gameDetails);
                        gamesWithProps.Add(gameWithProps);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, $"Failed to get props for game {game.Id}, skipping");
                        
                        // Add game without props rather than skip entirely
                        gamesWithProps.Add(new GameWithProps
                        {
                            Id = game.Id,
                            HomeTeam = game.HomeTeam,
                            AwayTeam = game.AwayTeam,
                            GameTime = game.CommenceTime,
                            Status = DetermineGameStatus(game),
                            Players = new List<PlayerPropDisplay>()
                        });
                    }
                }

                // Cache for 10 minutes
                await _cacheService.SetAsync(cacheKey, gamesWithProps, TimeSpan.FromMinutes(10));

                _logger.LogInformation($"Successfully built {gamesWithProps.Count} games with props for {sportKey}");
                return gamesWithProps;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error building games with props for {sportKey}");
                return new List<GameWithProps>();
            }
        }

        public async Task<bool> IsApiHealthyAsync()
        {
            try
            {
                var url = $"/v4/sports?apiKey={_config.ApiKey}";
                var response = await _httpClient.GetAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        #region Private Helper Methods

        private static bool IsSupportedSport(string sportKey)
        {
            var supportedSports = new[] { "basketball_nba", "americanfootball_nfl", "soccer_epl", "soccer_epl" };
            return supportedSports.Contains(sportKey);
        }

        private static string[] GetPlayerPropsMarkets(string sportKey)
        {
            return sportKey switch
            {
                "basketball_nba" => new[] { "player_points", "player_rebounds", "player_assists", "player_threes", 
                    "player_blocks", "player_steals", "player_points_rebounds_assists" },
                "americanfootball_nfl" => new[] { "player_pass_yds", "player_pass_tds", "player_rush_yds", 
                    "player_rush_tds", "player_reception_yds", "player_receptions" },
                "soccer_epl" => new[] { "player_shots_on_target", "player_shots", "player_assists" },
                _ => new[] { "player_points" }
            };
        }

        private static SportInfo MapToSportInfo(OddsApiSport oddsApiSport)
        {
            return new SportInfo
            {
                Key = oddsApiSport.Key,
                Title = oddsApiSport.Title,
                Group = oddsApiSport.Group,
                Description = oddsApiSport.Description,
                Active = oddsApiSport.Active,
                HasOutrights = oddsApiSport.Has_Outrights
            };
        }

        private static GameInfo MapToGameInfo(OddsApiGame oddsApiGame)
        {
            return new GameInfo
            { 
                Id = oddsApiGame.Id,
                SportKey = oddsApiGame.Sport_Key,
                SportTitle = oddsApiGame.Sport_Title,
                CommenceTime = oddsApiGame.Commence_Time,
                HomeTeam = oddsApiGame.Home_Team,
                AwayTeam = oddsApiGame.Away_Team,
                IsCompleted = oddsApiGame.Completed ?? false,
                IsLive = oddsApiGame.Commence_Time <= DateTime.UtcNow && !(oddsApiGame.Completed ?? false)
            };
        }

        private static GameDetails MapToGameDetails(OddsApiGameDetails oddsApiGame)
        {
            return new GameDetails
            {
                Id = oddsApiGame.Id,
                SportKey = oddsApiGame.Sport_Key,
                SportTitle = oddsApiGame.Sport_Title,
                CommenceTime = oddsApiGame.Commence_Time,
                HomeTeam = oddsApiGame.Home_Team,
                AwayTeam = oddsApiGame.Away_Team,
                IsCompleted = false,
                IsLive = oddsApiGame.Commence_Time <= DateTime.UtcNow,
                Bookmakers = oddsApiGame.Bookmakers.Select(MapToBookmaker).ToList()
            };
        }

        private static Bookmaker MapToBookmaker(OddsApiBookmaker oddsApiBookmaker)
        {
            return new Bookmaker
            {
                Key = oddsApiBookmaker.Key,
                Title = oddsApiBookmaker.Title,
                LastUpdate = oddsApiBookmaker.Last_Update,
                Markets = oddsApiBookmaker.Markets.Select(MapToMarket).ToList()
            };
        }

        private static Market MapToMarket(OddsApiMarket oddsApiMarket)
        {
            return new Market
            {
                Key = oddsApiMarket.Key,
                LastUpdate = oddsApiMarket.Last_Update,
                Outcomes = oddsApiMarket.Outcomes.Select(MapToOutcome).ToList()
            };
        }

        private static Outcome MapToOutcome(OddsApiOutcome oddsApiOutcome)
        {
            return new Outcome
            {
                Name = oddsApiOutcome.Name,
                Description = oddsApiOutcome.Description ?? string.Empty,
                Price = oddsApiOutcome.Price,
                Point = oddsApiOutcome.Point
            };
        }

        private static ICollection<PlayerProp> ExtractPlayerProps(OddsApiGameDetails gameDetails, string sportKey)
        {
            var playerProps = new List<PlayerProp>();
            var playerPropsMarkets = GetPlayerPropsMarkets(sportKey);

            foreach (var bookmaker in gameDetails.Bookmakers)
            {
                var propMarkets = bookmaker.Markets
                    .Where(m => playerPropsMarkets.Contains(m.Key))
                    .ToList();

                foreach (var market in propMarkets)
                {
                    var groupedByPlayer = market.Outcomes
                        .Where(o => !string.IsNullOrEmpty(o.Description))
                        .GroupBy(o => o.Description);

                    foreach (var playerGroup in groupedByPlayer)
                    {
                        var playerName = playerGroup.Key ?? "Unknown";
                        var outcomes = playerGroup.ToList();
                        
                        var overOutcome = outcomes.FirstOrDefault(o => o.Name.Equals("Over", StringComparison.OrdinalIgnoreCase));
                        var underOutcome = outcomes.FirstOrDefault(o => o.Name.Equals("Under", StringComparison.OrdinalIgnoreCase));

                        if (overOutcome != null && underOutcome != null && overOutcome.Point.HasValue)
                        {
                            var teamName = DeterminePlayerTeam(playerName, gameDetails.Home_Team, gameDetails.Away_Team);
                            
                            playerProps.Add(new PlayerProp
                            {
                                Id = $"{gameDetails.Id}_{market.Key}_{playerName}_{bookmaker.Key}",
                                GameId = gameDetails.Id,
                                TeamName = teamName,
                                PlayerName = playerName,
                                StatType = FormatStatType(market.Key),
                                Line = overOutcome.Point.Value,
                                OverOdds = overOutcome.Price,
                                UnderOdds = underOutcome.Price,
                                LastUpdate = market.Last_Update,
                                BookmakerKey = bookmaker.Key,
                                BookmakerTitle = bookmaker.Title,
                                RecentForm = GenerateMockRecentForm(overOutcome.Point.Value, sportKey), // Mock data for now
                                Avatar = GeneratePlayerAvatar(playerName),
                                Position = DeterminePlayerPosition(playerName, sportKey)
                            });
                        }
                    }
                }
            }

            // Remove duplicates (same player, same stat, prefer DraftKings)
            var uniqueProps = playerProps
                .GroupBy(p => new { p.PlayerName, p.StatType })
                .Select(g => g.OrderBy(p => p.BookmakerKey == "draftkings" ? 0 : 1).First())
                .ToList();

            return uniqueProps;
        }

        private static GameWithProps MapToGameWithProps(GameDetails gameDetails)
        {
            // Group player props by player
            var playerGroups = gameDetails.PlayerProps
                .GroupBy(p => p.PlayerName)
                .Take(6) // Limit to 6 players for mobile display
                .ToList();

            var players = playerGroups.Select(g =>
            {
                var firstProp = g.First();
                return new PlayerPropDisplay
                {
                    Id = firstProp.PlayerName.Replace(" ", "").ToLowerInvariant(),
                    Name = firstProp.PlayerName,
                    Team = firstProp.TeamName,
                    Position = firstProp.Position,
                    Avatar = firstProp.Avatar,
                    Stats = g.Take(3).Select(prop => new StatProp // Limit to 3 stats per player
                    {
                        Type = prop.StatType,
                        Line = prop.Line,
                        OverOdds = prop.OverOdds,
                        UnderOdds = prop.UnderOdds
                    }).ToList()
                };
            }).ToList();

            return new GameWithProps
            {
                Id = gameDetails.Id,
                HomeTeam = gameDetails.HomeTeam,
                AwayTeam = gameDetails.AwayTeam,
                GameTime = gameDetails.CommenceTime,
                Status = DetermineGameStatus(gameDetails),
                Players = players
            };
        }

        private static string GeneratePlayerAvatar(string playerName)
        {
            if (PlayerAvatarMap.TryGetValue(playerName, out var avatar))
                return avatar;

            // Generate from name initials
            var nameParts = playerName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (nameParts.Length >= 2)
                return $"{nameParts[0][0]}{nameParts[1][0]}";
            
            return nameParts.Length > 0 ? $"{nameParts[0][0]}?" : "??";
        }

        private static string DeterminePlayerTeam(string playerName, string homeTeam, string awayTeam)
        {
            // This would ideally come from a player database
            // For now, randomly assign for demonstration
            var hash = playerName.GetHashCode();
            return Math.Abs(hash) % 2 == 0 ? homeTeam : awayTeam;
        }

        private static string DeterminePlayerPosition(string playerName, string sportKey)
        {
            // Mock position assignment - in real implementation this would come from a database
            var positions = sportKey switch
            {
                "basketball_nba" => new[] { "PG", "SG", "SF", "PF", "C" },
                "americanfootball_nfl" => new[] { "QB", "RB", "WR", "TE", "K" },
                _ => new[] { "MID", "FWD", "DEF", "GK" }
            };
            
            var hash = Math.Abs(playerName.GetHashCode());
            return positions[hash % positions.Length];
        }

        private static List<decimal> GenerateMockRecentForm(decimal line, string sportKey)
        {
            // Generate realistic recent form data around the line
            var random = new Random(line.GetHashCode());
            var form = new List<decimal>();
            
            var variance = sportKey switch
            {
                "basketball_nba" => line * 0.3m, // 30% variance for NBA
                "americanfootball_nfl" => line * 0.4m, // 40% variance for NFL
                _ => line * 0.25m
            };

            for (int i = 0; i < 5; i++)
            {
                var adjustment = (decimal)(random.NextDouble() * 2 - 1) * variance;
                var value = Math.Max(0, line + adjustment);
                form.Add(Math.Round(value, 1));
            }

            return form;
        }

        private static string FormatStatType(string marketKey)
        {
            return marketKey switch
            {
                "player_points" => "Points",
                "player_rebounds" => "Rebounds", 
                "player_assists" => "Assists",
                "player_threes" => "3-Pointers",
                "player_blocks" => "Blocks",
                "player_steals" => "Steals",
                "player_points_rebounds_assists" => "Points + Rebounds + Assists",
                "player_pass_yds" => "Pass Yards",
                "player_pass_tds" => "Pass Touchdowns",
                "player_rush_yds" => "Rush Yards",
                "player_rush_tds" => "Rush Touchdowns",
                "player_reception_yds" => "Receiving Yards",
                "player_receptions" => "Receptions",
                "player_shots_on_target" => "Shots on Target",
                "player_shots" => "Shots",
                _ => marketKey.Replace("player_", "").Replace("_", " ")
            };
        }

        private static string DetermineGameStatus(GameInfo game)
        {
            if (game.IsCompleted) return "Completed";
            if (game.IsLive) return "Live";
            
            var timeToGame = game.CommenceTime - DateTime.UtcNow;
            if (timeToGame.TotalHours < 2)
                return "Starting Soon";
            
            return "Upcoming";
        }

        #endregion
    }
}