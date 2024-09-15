using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LeiaApi.Models;

public class LiteraryWork
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id {get; set;} = null!;
    
    [BsonElement("title")]
    public string Title {get; set;} = null!;

    [BsonElement("type")]
    public string Type {get; set;} = null!;
    
    [BsonElement("author")]
    public string Author {get; set;} = null!;
    
    [BsonElement("source")]
    public string Source {get; set;} = null!;
    
    [BsonElement("chapters")]
    public List<Chapter> Chapters {get; set;} = null!;
}