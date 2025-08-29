using Microsoft.Extensions.Caching.Memory;
using System.Collections;
using System.Text.Json;

namespace PlayerBet.Api.Services
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan expiration);
        Task RemoveAsync(string key);
        Task RemoveByPatternAsync(string pattern);
    }


    /// <summary>
    /// Cache service implementation using IMemoryCache
    /// Can be easily replaced with Redis implementation later
    /// </summary>
    public class MemoryCacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<MemoryCacheService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        public MemoryCacheService(IMemoryCache memoryCache, ILogger<MemoryCacheService> logger)
        {
            _memoryCache = memoryCache;
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
        }

        public Task<T?> GetAsync<T>(string key)
        {
            try
            {
                if (_memoryCache.TryGetValue(key, out var cachedValue))
                {
                    if (cachedValue is T directValue)
                    {
                        _logger.LogDebug($"Cache hit for key: {key}");
                        return Task.FromResult<T?>(directValue);
                    }

                    if (cachedValue is string jsonValue)
                    {
                        var deserializedValue = JsonSerializer.Deserialize<T>(jsonValue, _jsonOptions);
                        _logger.LogDebug($"Cache hit (JSON) for key: {key}");
                        return Task.FromResult(deserializedValue);
                    }
                }

                _logger.LogDebug($"Cache miss for key: {key}");
                return Task.FromResult<T?>(default);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error retrieving from cache for key: {key}");
                return Task.FromResult<T?>(default);
            }
        }

        public Task SetAsync<T>(string key, T value, TimeSpan expiration)
        {
            try
            {
                var options = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration,
                    Priority = CacheItemPriority.Normal
                };

                _memoryCache.Set(key, value, options);
                _logger.LogDebug($"Cache set for key: {key}, expiration: {expiration}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error setting cache for key: {key}");
            }

            return Task.CompletedTask;
        }

        public Task RemoveAsync(string key)
        {
            try
            {
                _memoryCache.Remove(key);
                _logger.LogDebug($"Cache removed for key: {key}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error removing cache for key: {key}");
            }

            return Task.CompletedTask;
        }

        public Task RemoveByPatternAsync(string pattern)
        {
            // Note: IMemoryCache doesn't natively support pattern-based removal
            // This is a simplified implementation
            // For Redis implementation, use KEYS pattern or proper pattern matching
            
            try
            {
                if (_memoryCache is MemoryCache mc)
                {
                    var field = typeof(MemoryCache).GetField("_coherentState", 
                        System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                    
                    if (field?.GetValue(mc) is object coherentState)
                    {
                        var entriesCollection = coherentState.GetType()
                            .GetProperty("EntriesCollection", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                        
                        if (entriesCollection?.GetValue(coherentState) is IDictionary entries)
                        {
                            var keysToRemove = new List<object>();
                            
                            foreach (DictionaryEntry entry in entries)
                            {
                                if (entry.Key.ToString()?.Contains(pattern) == true)
                                {
                                    keysToRemove.Add(entry.Key);
                                }
                            }

                            foreach (var key in keysToRemove)
                            {
                                _memoryCache.Remove(key);
                            }
                            
                            _logger.LogDebug($"Removed {keysToRemove.Count} cache entries matching pattern: {pattern}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error removing cache by pattern: {pattern}");
            }

            return Task.CompletedTask;
        }
    }

    /// <summary>
    /// Redis-based cache service implementation
    /// Use this for production environments
    /// </summary>
    public class RedisCacheService : ICacheService
    {
        private readonly ILogger<RedisCacheService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        // Note: Add StackExchange.Redis package for actual Redis implementation
        // private readonly IDatabase _database;

        public RedisCacheService(ILogger<RedisCacheService> logger)
        {
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
            
            // TODO: Initialize Redis connection
            // var connection = ConnectionMultiplexer.Connect(connectionString);
            // _database = connection.GetDatabase();
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            try
            {
                // TODO: Implement Redis get
                // var cachedValue = await _database.StringGetAsync(key);
                // if (cachedValue.HasValue)
                // {
                //     var deserializedValue = JsonSerializer.Deserialize<T>(cachedValue, _jsonOptions);
                //     _logger.LogDebug($"Redis cache hit for key: {key}");
                //     return deserializedValue;
                // }

                _logger.LogDebug($"Redis cache miss for key: {key}");
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error retrieving from Redis cache for key: {key}");
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan expiration)
        {
            try
            {
                // TODO: Implement Redis set
                // var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
                // await _database.StringSetAsync(key, serializedValue, expiration);
                // _logger.LogDebug($"Redis cache set for key: {key}, expiration: {expiration}");
                
                await Task.CompletedTask; // Remove when implementing Redis
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error setting Redis cache for key: {key}");
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                // TODO: Implement Redis remove
                // await _database.KeyDeleteAsync(key);
                // _logger.LogDebug($"Redis cache removed for key: {key}");
                
                await Task.CompletedTask; // Remove when implementing Redis
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error removing Redis cache for key: {key}");
            }
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            try
            {
                // TODO: Implement Redis pattern-based removal
                // var keys = _server.Keys(pattern: $"*{pattern}*");
                // await _database.KeyDeleteAsync(keys.ToArray());
                // _logger.LogDebug($"Removed Redis cache entries matching pattern: {pattern}");
                
                await Task.CompletedTask; // Remove when implementing Redis
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error removing Redis cache by pattern: {pattern}");
            }
        }
    }

}