namespace backend.Entities;
public class InterviewTurn
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid InterviewSessionId { get; set; }
    public int QuestionNumber { get; set; } // 1 to 8
    public string QuestionText { get; set; } = string.Empty;
    public string? UserTranscript { get; set; } // Captured live, graded post-interview
    public string? SuggestedImprovement { get; set; } // AI's rewritten/improved version of the user's answer
    public int TurnScore { get; set; } // e.g., 1 to 10

    // Navigation Property
    public InterviewSession Session { get; set; } = null!;
}