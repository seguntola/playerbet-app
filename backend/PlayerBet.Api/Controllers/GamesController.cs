using Microsoft.AspNetCore.Mvc;
using PlayerBet.Api.Services;
using PlayerBet.Api.Configuration;
using Microsoft.Extensions.Options;

namespace PlayerBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly ISportsDataService _sportsDataService;
        private readonly ILogger<GamesController> _logger;
        private readonly TheOddsApiConfiguration _config;

        public GamesController(
            ISportsDataService sportsDataService, 
            ILogger<GamesController> logger,
            IOptions<TheOddsApiConfiguration> config)
        {
            _sportsDataService = sportsDataService;
            _logger = logger;
            _config = config.Value;
        }

        // The endpoint your mobile app is calling
        [HttpGet("sports/{sportKey}/games-with-props")]
        public async Task<IActionResult> GetGamesWithProps(string sportKey, [FromQuery] int maxGames = 10)
        {
            try
            {
                var games = await _sportsDataService.GetGamesWithPropsAsync(sportKey, maxGames);
                return Ok(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching games with props for {sportKey}");
                return StatusCode(500, new { message = "Failed to fetch games", error = ex.Message });
            }
        }

        // Get upcoming games
        [HttpGet("sports/{sportKey}/upcoming")]
        public async Task<IActionResult> GetUpcomingGames(string sportKey, [FromQuery] int daysAhead = 7)
        {
            try
            {
                var games = await _sportsDataService.GetUpcomingGamesAsync(sportKey, daysAhead);
                return Ok(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching upcoming games for {sportKey}");
                return StatusCode(500, new { message = "Failed to fetch upcoming games", error = ex.Message });
            }
        }

        // NEW: Get available sports (all sports from TheOddsAPI)
        [HttpGet("sports")]
        public async Task<IActionResult> GetAvailableSports()
        {
            try
            {
                var sports = await _sportsDataService.GetAvailableSportsAsync();
                return Ok(sports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available sports");
                return StatusCode(500, new { message = "Failed to fetch sports", error = ex.Message });
            }
        }

        // NEW: Get sports with actual data available (for mobile app filtering)
        [HttpGet("sports-with-data")]
        public async Task<IActionResult> GetSportsWithData()
        {
            try
            {
                var sportsWithData = await _sportsDataService.GetSportsWithDataAsync();
                
                // Enhance with display configuration from appsettings
                var enhancedSports = sportsWithData.Select(sport =>
                {
                    var displayConfig = _config.SportDisplayConfigs.GetValueOrDefault(sport.Key);
                    
                    return new
                    {
                        key = sport.Key,
                        title = sport.Title,
                        group = sport.Group,
                        description = sport.Description,
                        active = sport.Active,
                        hasOutrights = sport.HasOutrights,
                        // Enhanced display info
                        displayInfo = displayConfig != null ? new
                        {
                            label = displayConfig.Label,
                            icon = displayConfig.Icon,
                            group = displayConfig.Group,
                            priority = displayConfig.Priority
                        } : new
                        {
                            label = sport.Title,
                            icon = "help-outline",
                            group = sport.Group,
                            priority = false
                        }
                    };
                });

                return Ok(enhancedSports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching sports with data");
                return StatusCode(500, new { message = "Failed to fetch sports with data", error = ex.Message });
            }
        }

        // NEW: Get sport display configuration (for mobile app UI)
        [HttpGet("sports-config")]
        public IActionResult GetSportsConfig()
        {
            try
            {
                var config = _config.SportDisplayConfigs.ToDictionary(
                    kvp => kvp.Key,
                    kvp => new
                    {
                        label = kvp.Value.Label,
                        icon = kvp.Value.Icon,
                        group = kvp.Value.Group,
                        priority = kvp.Value.Priority
                    }
                );

                return Ok(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching sports configuration");
                return StatusCode(500, new { message = "Failed to fetch sports configuration", error = ex.Message });
            }
        }
    }
}