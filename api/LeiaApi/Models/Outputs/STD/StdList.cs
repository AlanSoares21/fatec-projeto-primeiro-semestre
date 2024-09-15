namespace LeiaApi.Models;

public class StdList<T>
{
    public int Count {get; set;}
    public long Start {get; set;}
    public long Total {get; set;}
    public List<T> Data {get; set;} = null!;
}