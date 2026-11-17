using backend.claims;
using backend.Entities;
using backend.interfacecs;
using backend.mappers;
using backend.Repo;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.extentions;

public static class Extentions
{
    public static IServiceCollection ConfigureIdentity(this IServiceCollection services)
    {
        services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddClaimsPrincipalFactory<CustomUserClaimsPrincipalFactory>();

        return services;
    }
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        //Repos
        services.AddScoped<IInterviewRepo, InterviewRepo>();
        services.AddScoped<IUserRepo, UserRepo>();

        //Mappers
        services.AddTransient<ProfileMappers>();
        services.AddTransient<InterviewMappers>();

        //Services
        return services;
    }
    public static IServiceCollection AddDb(this IServiceCollection services, IConfiguration configuration)
    {
        var envType = configuration["Env:Environment"];
        if (string.IsNullOrEmpty(envType) || envType.Equals("placeholder", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("could not get environment from db");
        }
        services.AddDbContext<AppDbContext>(
            opt =>
            {
                string? connString = envType switch
                {
                    "dev" => configuration["Env:Dev"],
                    "prod" => configuration["Env:Prod"],
                    _ => throw new InvalidOperationException("Could not get connection string")
                };
                if (string.IsNullOrEmpty(connString) || connString.Equals("placeholder", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidDataException("Could not get connection string ");
                }
                opt.UseNpgsql(connString).UseSnakeCaseNamingConvention();
            }
        );
        return services;
    }
}