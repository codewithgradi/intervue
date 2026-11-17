using backend.dtos;
using backend.Entities;
using Riok.Mapperly.Abstractions;

namespace backend.mappers;

[Mapper]
public partial class ProfileMappers
{
    public partial UserProfile? MapToEntity(GetUserProfileDto profileDto);
    public partial GetUserProfileDto? MapToDto(UserProfile userProfile);
    public partial UserProfile? MapToEntityFromPost(PostProfileDto userProfile);
    public partial UserProfile? MapToEntityFromPost(PostProfileDto userProfile);
    public partial UserProfile? MapToEntityFromPut(PutUserProfileDto userProfile);
    
}