using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Data;
using PlayerBet.Api.Models;
using PlayerBet.Api.DTOs;

namespace PlayerBet.Api.Services
{
    public interface IBettingService
    {
        Task<Bet> CreateBetAsync(CreateBetDto createBetDto);
        Task<List<Bet>> GetUserBetsAsync(int userId);
        Task<Bet?> GetBetByIdAsync(int betId);
        decimal CalculatePayout(List<BetPickDto> picks, BetType betType, decimal amount);
        Task<bool> ProcessBetResultAsync(int betId);
    }

    public class BettingService : IBettingService
    {
        private readonly PlayerBetDbContext _context;

        public BettingService(PlayerBetDbContext context)
        {
            _context = context;
        }

        public async Task<Bet> CreateBetAsync(CreateBetDto createBetDto)
        {
            var bet = new Bet
            {
                UserId = createBetDto.UserId,
                Type = createBetDto.Type,
                Amount = createBetDto.Amount,
                PotentialPayout = CalculatePayout(createBetDto.Picks, createBetDto.Type, createBetDto.Amount),
                Status = BetStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Bets.Add(bet);
            await _context.SaveChangesAsync();

            // Add picks
            foreach (var pickDto in createBetDto.Picks)
            {
                var pick = new BetPick
                {
                    BetId = bet.Id,
                    GameId = pickDto.GameId,
                    TeamName = pickDto.TeamName,
                    PlayerName = pickDto.PlayerName,
                    StatType = pickDto.StatType,
                    Line = pickDto.Line,
                    PickType = pickDto.PickType,
                    Odds = pickDto.Odds,
                    Status = PickStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };
                _context.BetPicks.Add(pick);
            }

            await _context.SaveChangesAsync();

            // Deduct from user balance
            var user = await _context.Users.FindAsync(createBetDto.UserId);
            if (user != null)
            {
                user.Balance -= createBetDto.Amount;
                await _context.SaveChangesAsync();
            }

            return bet;
        }

        public async Task<List<Bet>> GetUserBetsAsync(int userId)
        {
            return await _context.Bets
                .Include(b => b.Picks)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Bet?> GetBetByIdAsync(int betId)
        {
            return await _context.Bets
                .Include(b => b.Picks)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == betId);
        }

        public decimal CalculatePayout(List<BetPickDto> picks, BetType betType, decimal amount)
        {
            if (!picks.Any()) return 0;

            decimal totalOdds = 1;
            foreach (var pick in picks)
            {
                totalOdds *= pick.Odds;
            }

            // Apply multiplier based on bet type and number of picks
            var multiplier = betType switch
            {
                BetType.SmartPlay => GetSmartPlayMultiplier(picks.Count),
                BetType.PerfectPick => GetPerfectPickMultiplier(picks.Count),
                _ => 1.0m
            };

            return Math.Round(amount * totalOdds * multiplier, 2);
        }

        public async Task<bool> ProcessBetResultAsync(int betId)
        {
            var bet = await GetBetByIdAsync(betId);
            if (bet == null) return false;

            var winningPicks = bet.Picks.Count(p => p.Status == PickStatus.Won);
            var losingPicks = bet.Picks.Count(p => p.Status == PickStatus.Lost);
            var totalPicks = bet.Picks.Count;

            if (bet.Type == BetType.PerfectPick)
            {
                // Perfect Pick: All must win
                if (losingPicks == 0 && winningPicks == totalPicks)
                {
                    bet.Status = BetStatus.Won;
                    bet.ActualPayout = bet.PotentialPayout;
                }
                else if (losingPicks > 0)
                {
                    bet.Status = BetStatus.Lost;
                    bet.ActualPayout = 0;
                }
            }
            else if (bet.Type == BetType.SmartPlay)
            {
                // Smart Play: More flexible
                if (losingPicks == 0)
                {
                    bet.Status = BetStatus.Won;
                    bet.ActualPayout = bet.PotentialPayout;
                }
                else if (losingPicks <= 2)
                {
                    bet.Status = BetStatus.Partially_Won;
                    var payoutPercentage = losingPicks == 1 ? 0.6m : losingPicks == 2 ? 0.25m : 0;
                    bet.ActualPayout = Math.Round(bet.PotentialPayout * payoutPercentage, 2);
                }
                else
                {
                    bet.Status = BetStatus.Lost;
                    bet.ActualPayout = 0;
                }
            }

            bet.UpdatedAt = DateTime.UtcNow;

            // Add winnings to user balance
            if (bet.ActualPayout > 0)
            {
                bet.User.Balance += bet.ActualPayout.Value;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private decimal GetSmartPlayMultiplier(int pickCount)
        {
            return pickCount switch
            {
                1 => 0.9m,
                2 => 1.1m,
                3 => 1.3m,
                4 => 1.6m,
                5 => 2.0m,
                6 => 2.5m,
                7 => 3.0m,
                8 => 3.8m,
                _ => 1.0m
            };
        }

        private decimal GetPerfectPickMultiplier(int pickCount)
        {
            return pickCount switch
            {
                1 => 1.0m,
                2 => 1.3m,
                3 => 1.8m,
                4 => 2.5m,
                5 => 3.5m,
                6 => 5.0m,
                7 => 7.5m,
                8 => 12.0m,
                9 => 20.0m,
                10 => 35.0m,
                11 => 60.0m,
                12 => 100.0m,
                _ => 1.0m
            };
        }
    }
}