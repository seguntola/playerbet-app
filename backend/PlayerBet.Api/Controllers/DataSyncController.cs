using Microsoft.AspNetCore.Mvc;
using PlayerBet.Api.Services;

namespace PlayerBet.Api.Controllers
{
    /// <summary>
    /// Admin controller for managing data sync
    /// </summary>
    [ApiController]
    [Route("admin/[controller]")]
    public class DataSyncController : ControllerBase
    {
        private readonly IDataSyncService _dataSyncService;
        private readonly ISportsDataService _sportsDataService;
        private readonly ILogger<DataSyncController> _logger;

        public DataSyncController(
            IDataSyncService dataSyncService,
            ISportsDataService sportsDataService,
            ILogger<DataSyncController> logger)
        {
            _dataSyncService = dataSyncService;
            _sportsDataService = sportsDataService;
            _logger = logger;
        }

        [HttpPost("sync-all")]
        public async Task<IActionResult> SyncAll()
        {
            try
            {
                await _dataSyncService.SyncAllSportsDataAsync();
                return StatusCode(200, new { message = "Data sync initiated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initiating data sync");
                return StatusCode(500, new { message = "Error initiating data sync", error = ex.Message });
            }
        }

        [HttpPost("sync/{sportKey}")]
        public async Task<IActionResult> SyncSport(string sportKey)
        {
            try
            {
                await _dataSyncService.SyncSportDataAsync(sportKey);
                return Ok(new { message = $"Data sync for {sportKey} completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error syncing {sportKey}");
                return StatusCode(500, new { message = $"Error syncing {sportKey}", error = ex.Message });
            }
        }

        [HttpPost("warm-cache")]
        public async Task<IActionResult> WarmCache()
        {
            try
            {
                await _dataSyncService.WarmCacheAsync();
                return Ok(new { message = "Cache warm-up completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming cache");
                return StatusCode(500, new { message = "Error warming cache", error = ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetSyncStatus()
        {
            try
            {
                var status = await _dataSyncService.GetSyncStatusAsync();
                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sync status");
                return StatusCode(500, new { message = "Error getting sync status", error = ex.Message });
            }
        }

        [HttpGet("health")]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var isHealthy = await _sportsDataService.IsApiHealthyAsync();
                return Ok(new { 
                    isHealthy, 
                    timestamp = DateTime.UtcNow,
                    message = isHealthy ? "TheOddsAPI is healthy" : "TheOddsAPI is not responding"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking API health");
                return StatusCode(500, new { message = "Error checking API health", error = ex.Message });
            }
        }
    }
}