using Microsoft.AspNetCore.Mvc;

namespace PlayerBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetGames()
        {
            // Mock data for development
            var games = new[]
            {
                new
                {
                    id = "game1",
                    homeTeam = "Lakers",
                    awayTeam = "Warriors",
                    gameTime = DateTime.Now.AddHours(2),
                    status = "Upcoming",
                    players = new[]
                    {
                        new
                        {
                            id = "player1",
                            name = "LeBron James",
                            team = "Lakers",
                            position = "SF",
                            stats = new[]
                            {
                                new { type = "Points", line = 25.5m, overOdds = 1.90m, underOdds = 1.90m },
                                new { type = "Assists", line = 8.5m, overOdds = 2.10m, underOdds = 1.75m },
                                new { type = "Rebounds", line = 7.5m, overOdds = 1.85m, underOdds = 1.95m }
                            }
                        },
                        new
                        {
                            id = "player2",
                            name = "Stephen Curry",
                            team = "Warriors",
                            position = "PG",
                            stats = new[]
                            {
                                new { type = "Points", line = 28.5m, overOdds = 1.95m, underOdds = 1.85m },
                                new { type = "3-Pointers", line = 4.5m, overOdds = 1.80m, underOdds = 2.00m },
                                new { type = "Assists", line = 6.5m, overOdds = 1.75m, underOdds = 2.05m }
                            }
                        }
                    }
                },
                new
                {
                    id = "game2",
                    homeTeam = "Heat",
                    awayTeam = "Celtics",
                    gameTime = DateTime.Now.AddHours(4),
                    status = "Upcoming",
                    players = new[]
                    {
                        new
                        {
                            id = "player3",
                            name = "Jimmy Butler",
                            team = "Heat",
                            position = "SF",
                            stats = new[]
                            {
                                new { type = "Points", line = 22.5m, overOdds = 1.88m, underOdds = 1.92m },
                                new { type = "Rebounds", line = 6.5m, overOdds = 1.90m, underOdds = 1.90m },
                                new { type = "Steals", line = 1.5m, overOdds = 2.20m, underOdds = 1.65m }
                            }
                        },
                        new
                        {
                            id = "player4",
                            name = "Jayson Tatum",
                            team = "Celtics",
                            position = "SF",
                            stats = new[]
                            {
                                new { type = "Points", line = 27.5m, overOdds = 1.92m, underOdds = 1.88m },
                                new { type = "Rebounds", line = 8.5m, overOdds = 1.85m, underOdds = 1.95m },
                                new { type = "Assists", line = 4.5m, overOdds = 2.00m, underOdds = 1.80m }
                            }
                        }
                    }
                }
            };

            return Ok(games);
        }
    }
}