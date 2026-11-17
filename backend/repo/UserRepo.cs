using backend.Entities;
using backend.interfacecs;
using Microsoft.EntityFrameworkCore;
namespace backend.Repo;

public class UserRepo : IUserRepo
{
    private readonly AppDbContext _context;

    public UserRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateProfileAsync(UserProfile profile)
    {
        await _context.AddAsync(profile);
        await _context.SaveChangesAsync();
    }

    public async Task<UserProfile?> GetProfileAsync(Guid userId)
    {
        return await _context.UserProfiles.FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async void UpdateProfileAsync(UserProfile profile)
    {
        _context.UserProfiles.Update(profile);
        await _context.SaveChangesAsync();
    }
   
}