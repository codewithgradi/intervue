namespace backend.Entities;
public class InterviewSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string TargetRole { get; set; } = string.Empty; // e.g., "Data Analyst"

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } // Enforces the 1-hour maximum limit
    public DateTime? CompletedAt { get; set; }

    public string Status { get; set; } = "InProgress"; // InProgress, Evaluating, Completed, Expired
    public bool IsCompleted { get; set; } = false;

    // Post-interview aggregate analytics
    public int? OverallScore { get; set; }
    public string? SummaryFeedback { get; set; }

    // Navigation Properties
    public ApplicationUser User { get; set; } = null!;
    public ICollection<InterviewTurn> Turns { get; set; } = new List<InterviewTurn>();
}
