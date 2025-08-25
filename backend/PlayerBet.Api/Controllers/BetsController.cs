using Microsoft.AspNetCore.Mvc;
using PlayerBet.Api.Services;
using PlayerBet.Api.DTOs;
using PlayerBet.Api.Models;

namespace PlayerBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BetsController : ControllerBase
    {
        private readonly IBettingService _bettingService;
        private readonly IUsersService _usersService;

        public BetsController(IBettingService bettingService, IUsersService usersService)
        {
            _bettingService = bettingService;
            _usersService = usersService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBet([FromBody] CreateBetDto createBetDto)
        {
            try
            {
                // Validate user exists and has sufficient balance
                var user = await _usersService.GetUserByIdAsync(createBetDto.UserId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                if (user.Balance < createBetDto.Amount)
                {
                    return BadRequest(new { message = "Insufficient balance" });
                }

                // Validate bet type constraints
                if (createBetDto.Type == BetType.SmartPlay && createBetDto.Picks.Count > 8)
                {
                    return BadRequest(new { message = "Smart Play can have maximum 8 picks" });
                }

                if (createBetDto.Type == BetType.PerfectPick && createBetDto.Picks.Count > 12)
                {
                    return BadRequest(new { message = "Perfect Pick can have maximum 12 picks" });
                }

                if (createBetDto.Picks.Count == 0)
                {
                    return BadRequest(new { message = "At least one pick is required" });
                }

                var bet = await _bettingService.CreateBetAsync(createBetDto);

                return Ok(new
                {
                    message = "Bet created successfully",
                    bet = new
                    {
                        id = bet.Id,
                        type = bet.Type.ToString(),
                        amount = bet.Amount,
                        potentialPayout = bet.PotentialPayout,
                        status = bet.Status.ToString(),
                        createdAt = bet.CreatedAt,
                        pickCount = createBetDto.Picks.Count
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred creating the bet", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBets(int userId)
        {
            try
            {
                var bets = await _bettingService.GetUserBetsAsync(userId);

                var betResponse = bets.Select(b => new
                {
                    id = b.Id,
                    type = b.Type.ToString(),
                    amount = b.Amount,
                    potentialPayout = b.PotentialPayout,
                    actualPayout = b.ActualPayout,
                    status = b.Status.ToString(),
                    createdAt = b.CreatedAt,
                    updatedAt = b.UpdatedAt,
                    pickCount = b.Picks.Count,
                    picks = b.Picks.Select(p => new
                    {
                        id = p.Id,
                        gameId = p.GameId,
                        teamName = p.TeamName,
                        playerName = p.PlayerName,
                        statType = p.StatType,
                        line = p.Line,
                        pickType = p.PickType.ToString(),
                        odds = p.Odds,
                        actualValue = p.ActualValue,
                        status = p.Status.ToString()
                    })
                });

                return Ok(betResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpGet("{betId}")]
        public async Task<IActionResult> GetBet(int betId)
        {
            try
            {
                var bet = await _bettingService.GetBetByIdAsync(betId);
                
                if (bet == null)
                {
                    return NotFound(new { message = "Bet not found" });
                }

                return Ok(new
                {
                    id = bet.Id,
                    type = bet.Type.ToString(),
                    amount = bet.Amount,
                    potentialPayout = bet.PotentialPayout,
                    actualPayout = bet.ActualPayout,
                    status = bet.Status.ToString(),
                    createdAt = bet.CreatedAt,
                    updatedAt = bet.UpdatedAt,
                    user = new
                    {
                        id = bet.User.Id,
                        name = $"{bet.User.FirstName} {bet.User.LastName}",
                        username = bet.User.Username
                    },
                    picks = bet.Picks.Select(p => new
                    {
                        id = p.Id,
                        gameId = p.GameId,
                        teamName = p.TeamName,
                        playerName = p.PlayerName,
                        statType = p.StatType,
                        line = p.Line,
                        pickType = p.PickType.ToString(),
                        odds = p.Odds,
                        actualValue = p.ActualValue,
                        status = p.Status.ToString()
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost("calculate-payout")]
        public IActionResult CalculatePayout([FromBody] CalculatePayoutDto dto)
        {
            try
            {
                var payout = _bettingService.CalculatePayout(dto.Picks, dto.Type, dto.Amount);
                
                return Ok(new
                {
                    amount = dto.Amount,
                    potentialPayout = payout,
                    multiplier = Math.Round(payout / dto.Amount, 2),
                    type = dto.Type.ToString(),
                    pickCount = dto.Picks.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }

    public class CalculatePayoutDto
    {
        public BetType Type { get; set; }
        public decimal Amount { get; set; }
        public List<BetPickDto> Picks { get; set; } = new();
    }
}