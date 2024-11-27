namespace AdminPortal.Models.Cache;

public class TTSQueueEntry
{
    public string WorkId { get; set;} = "";
    public DateTime RequestedAt { get; set; }
}