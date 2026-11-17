namespace backend.Entities;

public class UserProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string CurrentRole { get; set; } = string.Empty;

    // Stored as a JSON object (jsonb in PostgreSQL)
    public List<string> TechStack { get; set; } = new();

    public int YearsOfExperience { get; set; }

    // Navigation Property
    public ApplicationUser User { get; set; } = null!;
}
