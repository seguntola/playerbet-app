using PlayerBet.Api.Configuration;
using Microsoft.Extensions.Options;

namespace PlayerBet.Api.Services
{
    /// <summary>
    /// Service for syncing sports data in the background
    /// </summary>
    public interface IDataSyncService
    {
        Task SyncAllSportsDataAsync();
        Task SyncSportDataAsync(string sportKey);
        Task SyncUpcomingGamesAsync(string sportKey);
        Task WarmCacheAsync();
        Task<DataSyncStatus> GetSyncStatusAsync();
    }

    public class DataSyncStatus
    {
        public DateTime LastSyncTime { get; set; }
        public Dictionary<string, DateTime> SportSyncTimes { get; set; } = new();
        public Dictionary<string, int> SportGameCounts { get; set; } = new();
        public bool IsHealthy { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    /// <summary>
    /// Background service for syncing sports data
    /// </summary>
    public class DataSyncService : IDataSyncService
    {
        private readonly ISportsDataService _sportsDataService;
        private readonly ICacheService _cacheService;
        private readonly ILogger<DataSyncService> _logger;
        private readonly TheOddsApiConfiguration _config;
        private readonly SemaphoreSlim _syncSemaphore;
        private DataSyncStatus _lastSyncStatus = new();

        public DataSyncService(
            ISportsDataService sportsDataService,
            ICacheService cacheService,
            ILogger<DataSyncService> logger,
            IOptions<TheOddsApiConfiguration> config)
        {
            _sportsDataService = sportsDataService;
            _cacheService = cacheService;
            _logger = logger;
            _config = config.Value;
            _syncSemaphore = new SemaphoreSlim(1, 1);
        }

        public async Task SyncAllSportsDataAsync()
        {
            if (!await _syncSemaphore.WaitAsync(TimeSpan.FromMinutes(1)))
            {
                _logger.LogWarning("Data sync already in progress, skipping");
                return;
            }

            try
            {
                _logger.LogInformation("Starting full sports data sync");
                var startTime = DateTime.UtcNow;
                var errors = new List<string>();
                var sportSyncTimes = new Dictionary<string, DateTime>();
                var sportGameCounts = new Dictionary<string, int>();

                // Check API health first
                var isHealthy = await _sportsDataService.IsApiHealthyAsync();
                if (!isHealthy)
                {
                    var error = "TheOddsAPI is not healthy, skipping sync";
                    _logger.LogWarning(error);
                    errors.Add(error);
                    
                    _lastSyncStatus = new DataSyncStatus
                    {
                        LastSyncTime = startTime,
                        IsHealthy = false,
                        Errors = errors
                    };
                    return;
                }

                // Sync each supported sport
                foreach (var sportKey in _config.SupportedSports)
                {
                    try
                    {
                        await SyncSportDataAsync(sportKey);
                        sportSyncTimes[sportKey] = DateTime.UtcNow;
                        
                        // Get game count for status
                        var games = await _sportsDataService.GetUpcomingGamesAsync(sportKey);
                        sportGameCounts[sportKey] = games.Count();
                        
                        _logger.LogInformation($"Successfully synced {sportKey}: {sportGameCounts[sportKey]} games");
                    }
                    catch (Exception ex)
                    {
                        var error = $"Failed to sync {sportKey}: {ex.Message}";
                        _logger.LogError(ex, error);
                        errors.Add(error);
                    }
                    
                    // Add delay between sports to respect rate limits
                    await Task.Delay(TimeSpan.FromSeconds(2));
                }

                _lastSyncStatus = new DataSyncStatus
                {
                    LastSyncTime = startTime,
                    SportSyncTimes = sportSyncTimes,
                    SportGameCounts = sportGameCounts,
                    IsHealthy = errors.Count == 0,
                    Errors = errors
                };

                var duration = DateTime.UtcNow - startTime;
                _logger.LogInformation($"Completed full sports data sync in {duration.TotalSeconds:F2} seconds");
            }
            finally
            {
                _syncSemaphore.Release();
            }
        }

        public async Task SyncSportDataAsync(string sportKey)
        {
            _logger.LogInformation($"Starting sync for {sportKey}");

            try
            {
                // Pre-load upcoming games to warm the cache
                await SyncUpcomingGamesAsync(sportKey);

                // Pre-load games with props for faster mobile response
                await _sportsDataService.GetGamesWithPropsAsync(sportKey, 6);

                _logger.LogInformation($"Successfully synced {sportKey}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error syncing {sportKey}");
                throw;
            }
        }

        public async Task SyncUpcomingGamesAsync(string sportKey)
        {
            try
            {
                var games = await _sportsDataService.GetUpcomingGamesAsync(sportKey);
                _logger.LogDebug($"Synced {games.Count()} upcoming games for {sportKey}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error syncing upcoming games for {sportKey}");
                throw;
            }
        }

        public async Task WarmCacheAsync()
        {
            _logger.LogInformation("Starting cache warm-up");

            try
            {
                var tasks = new List<Task>();

                foreach (var sportKey in _config.SupportedSports)
                {
                    // Warm up games with props cache (most commonly requested)
                    tasks.Add(_sportsDataService.GetGamesWithPropsAsync(sportKey, 4));
                    
                    // Add small delay to stagger requests
                    await Task.Delay(500);
                }

                await Task.WhenAll(tasks);
                _logger.LogInformation("Cache warm-up completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during cache warm-up");
            }
        }

        public Task<DataSyncStatus> GetSyncStatusAsync()
        {
            return Task.FromResult(_lastSyncStatus);
        }
    }
}