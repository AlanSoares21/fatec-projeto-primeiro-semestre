using MongoDB.Bson.Serialization.Attributes;

namespace LeiaApi.Models;

public class Chapter
{
    [BsonElement("title")]
    public string Title {get; set;} = null!;
    
    [BsonElement("size")]
    public int Size {get; set;}
    
    [BsonElement("source")]
    public string Source {get; set;} = null!;
    
    [BsonElement("filePath")]
    public string FilePath {get; set;} = null!;
    [BsonElement("mp3")]
    public string? Mp3 {get; set;} = null;
}