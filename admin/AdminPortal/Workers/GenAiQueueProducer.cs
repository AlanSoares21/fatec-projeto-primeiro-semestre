
using System.Text;
using AdminPortal.Models.Cache;
using AdminPortal.Services;
using RabbitMQ.Client;

namespace AdminPortal.Workers;

public class GenAiQueueProducer : BackgroundService
{
    ILogger<GenAiQueueProducer> _log;
    int _delayInSeconds;
    IGenAiService _genAiService;
    DateTime _lastRun = DateTime.MinValue;
    ConnectionFactory _rbmqConnectionFactory;
    readonly string WORKS_TTS_QUEUE = "TTS";
    
    public GenAiQueueProducer(
        ILogger<GenAiQueueProducer> logger,
        IConfiguration config,
        IGenAiService genAiService) 
    {
        _log = logger;
        _genAiService = genAiService;
        _rbmqConnectionFactory = ServerUtils.GetRabbitMQConnectionFactory(config, _log);
        var delayStr = config["WorkerInterval:GenAiQueueProducerInSeconds"];
        
        if (int.TryParse(delayStr, out _delayInSeconds)) {
            _log.LogInformation("Success on getting delay value from config: {delay} seconds", _delayInSeconds);
        } else {
            _delayInSeconds = 120;
            _log.LogInformation("Fail on getting delay value from config: {delay} seconds(default)", _delayInSeconds);
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int delay = _delayInSeconds * 1000;
        _log.LogInformation("GenAIQueueProducer woker start - delay: {delay}(miliseconds)", delay);
        _log.LogInformation("Connecting to RabbitMQ");
        using (var conn = await _rbmqConnectionFactory.CreateConnectionAsync()) 
        using (var channel = await conn.CreateChannelAsync())  {
            await channel.QueueDeclareAsync(
                queue: WORKS_TTS_QUEUE, 
                durable: false,
                exclusive: false,
                autoDelete: false);
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(delay);
                    await Handle(channel);   
                }
                catch (System.Exception ex)
                {
                    _log.LogCritical("Unknowed erro: {m}\n {s}", ex.Message, ex.StackTrace);
                }
            }
        }
        _log.LogInformation("Connection to RabbitMQ closed");
        _log.LogInformation("GenAIQueueProducer woker stop");
    }

    async Task Handle(IChannel channel) {
        (List<TTSQueueEntry> works, DateTime searchWorksAt) = await ListWorksToAdd();
        foreach (var work in works)
        {
            await channel.BasicPublishAsync(
                exchange: string.Empty, 
                routingKey: WORKS_TTS_QUEUE,
                body: Encoding.ASCII.GetBytes(work.WorkId)
            );
        }
        _lastRun = searchWorksAt;
        _log.LogInformation("GenAiQueueProducer has finished processing works in the queue. searched works at: {date}", 
            searchWorksAt);
    }

    async Task<(List<TTSQueueEntry> list, DateTime searchWorksAt)> ListWorksToAdd() {
        _log.LogInformation("Listing works to create ai content. last run: {last}", _lastRun);
        DateTime searchWorksAt = DateTime.UtcNow;
        var works = await _genAiService.GetWorksInTheQueue();
        _log.LogInformation("{count} works in the queue", works.Count);
        var worksToAdd = works.Where(w => w.RequestedAt >= _lastRun).ToList();
        _log.LogInformation("{count} works to be added in the queue", worksToAdd.Count);
        return (worksToAdd, searchWorksAt);
    }
}