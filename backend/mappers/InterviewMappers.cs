using backend.dtos;
using backend.Entities;
using Riok.Mapperly.Abstractions;

[Mapper]
public partial class InterviewMappers
{
    public partial InterviewSession? MapToEntitySession(InterviewSessionDto dto);
    public partial InterviewSessionDto? MapToDtoInterviewSession(InterviewSession dto);
    public partial InterviewTurn? MapToEntityInterviewTurn(InterviewTurnDto dto);
    public partial InterviewTurnDto? MapToDtoInterviewTurn(InterviewTurn dto);


}