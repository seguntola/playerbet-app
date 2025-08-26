using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Models;

namespace PlayerBet.Api.Data
{
    public class PlayerBetDbContext : DbContext
    {
        public PlayerBetDbContext(DbContextOptions<PlayerBetDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Bet> Bets { get; set; }
        public DbSet<BetPick> BetPicks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Balance).HasColumnType("decimal(18,2)");
                
                // Unique constraints
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.PhoneNumber).IsUnique();
            });

            // Bet configuration
            modelBuilder.Entity<Bet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PotentialPayout).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ActualPayout).HasColumnType("decimal(18,2)");
                
                // Foreign key relationship
                entity.HasOne(b => b.User)
                      .WithMany(u => u.Bets)
                      .HasForeignKey(b => b.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // BetPick configuration
            modelBuilder.Entity<BetPick>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Line).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Odds).HasColumnType("decimal(18,4)");
                entity.Property(e => e.ActualValue).HasColumnType("decimal(18,2)");
                
                // Foreign key relationship
                entity.HasOne(bp => bp.Bet)
                      .WithMany(b => b.Picks)
                      .HasForeignKey(bp => bp.BetId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}