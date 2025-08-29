using Microsoft.Extensions.Options;
using PlayerBet.Api.Configuration;
using PlayerBet.Api.Services;

/// <summary>
/// Hosted background service that runs data sync periodically
/// </summary>
public class DataSyncBackgroundService : BackgroundService
{
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DataSyncBackgroundService> _logger;
        private readonly TheOddsApiConfiguration _config;

        public DataSyncBackgroundService(
            IServiceProvider serviceProvider, 
            ILogger<DataSyncBackgroundService> logger,
            IOptions<TheOddsApiConfiguration> config)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _config = config.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Data sync background service started");

            // Initial warm-up delay
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

            // Initial cache warm-up
            using (var scope = _serviceProvider.CreateScope())
            {
                var dataSyncService = scope.ServiceProvider.GetRequiredService<IDataSyncService>();
                await dataSyncService.WarmCacheAsync();
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var dataSyncService = scope.ServiceProvider.GetRequiredService<IDataSyncService>();
                    
                    await dataSyncService.SyncAllSportsDataAsync();

                    // Wait 15 minutes before next sync
                    await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Data sync background service stopping");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in data sync background service");
                    
                    // Wait a bit before retrying on error
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }

            _logger.LogInformation("Data sync background service stopped");
        }
    }