using System.ComponentModel.DataAnnotations;

namespace backend.dtos;

public class InterviewTurnDto
{
    public Guid Id { get; set; }
    public Guid InterviewSessionId { get; set; }
    public int QuestionNumber { get; set; } // 1 to 8
    public string QuestionText { get; set; } = string.Empty;
    public string? UserTranscript { get; set; } // Captured live, graded post-interview
    public string? SuggestedImprovement { get; set; } // AI's rewritten/improved version of the user's answer
    public int TurnScore { get; set; } // e.g., 1 to 10

    // Navigation Property
    public InterviewSessionDto Session { get; set; } = null!;
}


public class InterviewSessionDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string TargetRole { get; set; }

    public DateTime StartedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; } = "InProgress";
    public bool IsCompleted { get; set; } = false;

    // Post-interview aggregate analytics
    public int? OverallScore { get; set; }
    public string? SummaryFeedback { get; set; }

    // Navigation Properties
    public ICollection<InterviewTurnDto>? Turns { get; set; }
}

public class UserTranscribedAnswer
{
    [Required(ErrorMessage = "Please provide input")]
    public string Text { get; set; } = string.Empty;
}
public class GetInterviewQuesionDto
{
    public string Question { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;

}
public class GetUserInterviewAnswerDto
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;

}
public class QuestionAndAnswerBodyDtoForAI
{
    [Required(ErrorMessage = "please provide question")]
    public string QuestionText { get; set; } = string.Empty;
    [Required(ErrorMessage = "please provide answer from user")]
    public string? UserTranscript { get; set; }
}