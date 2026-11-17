namespace backend.dtos;

public class GetUserProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string CurrentRole { get; set; } = string.Empty;

    // Stored as a JSON object (jsonb in PostgreSQL)
    public List<string> TechStack { get; set; } = new();
    public int YearsOfExperience { get; set; }
}

public class PostProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string CurrentRole { get; set; } = string.Empty;
    // Stored as a JSON object (jsonb in PostgreSQL)
    public List<string> TechStack { get; set; } = new();
    public int YearsOfExperience { get; set; }
}
public class PutUserProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string CurrentRole { get; set; } = string.Empty;

    // Stored as a JSON object (jsonb in PostgreSQL)
    public List<string> TechStack { get; set; } = new();
    public int YearsOfExperience { get; set; }
}