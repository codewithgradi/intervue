public class Dataset
{
    public Guid Id { get; set; }
    public List<QuestionBody>? Questions { get; set; }

}

public class QuestionBody
{
    public string Question { get; set; }=string.Empty;
    public string Answer { get; set; }=string.Empty;
    public string Category { get; set; }=string.Empty;
    public string Difficulty { get; set; }=string.Empty;
    
}