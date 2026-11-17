using backend.dtos;

public interface IInterviewRepo
{
    Task StartSession(string userID);//returns session id
    //Returns a single question from dataset table random and saves it to interview turns for it sessio
    Task GetQuestion(string sessionID);
    Task GetOneQuestionFeedback(string questionID, string sessionID, QuestionAndAnswerBodyDtoForAI body);
    Task GetOverallFeedback(string sessionID);
    Task EndSession(string sessionID);
    Task IsValidSession(string sessionID);

}