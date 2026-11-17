using backend.dtos;

public class InterviewRepo : IInterviewRepo
{
    public Task EndSession(string sessionID)
    {
        throw new NotImplementedException();
    }

    public Task GetOneQuestionFeedback(string questionID, string sessionID, QuestionAndAnswerBodyDtoForAI body)
    {
        throw new NotImplementedException();
    }

    public Task GetOverallFeedback(string sessionID)
    {
        throw new NotImplementedException();
    }

    public Task GetQuestion(string sessionID)
    {
        throw new NotImplementedException();
    }

    public Task IsValidSession(string sessionID)
    {
        throw new NotImplementedException();
    }

    public Task StartSession(string userID)
    {
        throw new NotImplementedException();
    }
}