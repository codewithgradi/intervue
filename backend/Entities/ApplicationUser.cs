using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public UserProfile? Profile { get; set; }
    public ICollection<InterviewSession> Sessions { get; set; } = new List<InterviewSession>();
}
