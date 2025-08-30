using Microsoft.AspNetCore.Mvc;
using PlayerBet.Api.Services;

namespace PlayerBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly ISportsDataService _sportsDataService;
        private readonly ILogger<GamesController> _logger;

        public GamesController(ISportsDataService sportsDataService, ILogger<GamesController> logger)
        {
            _sportsDataService = sportsDataService;
            _logger = logger;
        }

        // NEW: The endpoint your mobile app is calling
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

        // NEW: Get upcoming games
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

        // NEW: Get available sports
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

        // // Keep existing mock endpoint for backward compatibility
        // [HttpGet("mock")]
        // public IActionResult GetMockGames()
        // {
        //     // Your existing mock data...
        // }
    }
}