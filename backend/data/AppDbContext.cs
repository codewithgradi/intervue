using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Entities;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<InterviewSession> InterviewSessions { get; set; }
    public DbSet<InterviewTurn> InterviewTurns { get; set; }
    public DbSet<Dataset> Datasets{get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        // 1. ApplicationUser <-> UserProfile (One-to-One)
        modelBuilder.Entity<ApplicationUser>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<UserProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // 2. ApplicationUser <-> InterviewSession (One-to-Many)
        modelBuilder.Entity<ApplicationUser>()
            .HasMany(u => u.Sessions)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // 3. InterviewSession <-> InterviewTurn (One-to-Many)
        modelBuilder.Entity<InterviewSession>()
            .HasMany(s => s.Turns)
            .WithOne(t => t.Session)
            .HasForeignKey(t => t.InterviewSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // 4. Map TechStack list to native PostgreSQL jsonb column
        modelBuilder.Entity<UserProfile>()
            .Property(p => p.TechStack)
            .HasColumnType("jsonb");
        
        modelBuilder.Entity<Dataset>().OwnsMany(q=>q.Questions, builder =>
        {
            builder.ToJson();
        });
    }
}