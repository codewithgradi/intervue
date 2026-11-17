using backend.dtos;
using backend.Entities;

namespace backend.interfacecs;

public interface IUserRepo
{
    Task<UserProfile?> GetProfileAsync(Guid userId);
    void UpdateProfileAsync(UserProfile profile);
    Task CreateProfileAsync(UserProfile profile);
}