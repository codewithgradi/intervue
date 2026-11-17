using System.Security.Claims;
using backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace backend.claims;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> options
    ) : base(userManager, roleManager, options) { }
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        if (!string.IsNullOrEmpty(user.Profile.FirstName))
        {
            identity.AddClaim(new Claim("firstName", user.Profile.FirstName));
        }
        if (!string.IsNullOrEmpty(user.Id.ToString()))
        {
            identity.AddClaim(new Claim("userId", user.Id.ToString()));
        }
        return identity;
    }
}