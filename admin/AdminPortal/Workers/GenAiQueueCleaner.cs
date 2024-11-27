
using System.Text;
using AdminPortal.Services;
using RabbitMQ.Client;

namespace AdminPortal.Workers;

public class GenAiQueueCleaner : BackgroundService
{
    ILogger<GenAiQueueCleaner> _log;
    int _delayInSeconds;
    IGenAiService _genAiService;
    ConnectionFactory _rbmqConnectionFactory;
    readonly string WORKS_TTS_COMPLETED_QUEUE = "TTS_COMPLETED";
    
    public GenAiQueueCleaner(
        ILogger<GenAiQueueCleaner> logger,
        IConfiguration config,
        IGenAiService genAiService) 
    {
        _log = logger;
        _genAiService = genAiService;
        _rbmqConnectionFactory = ServerUtils.GetRabbitMQConnectionFactory(config, _log);
        var delayStr = config["WorkerInterval:GenAiQueueCleanerInSeconds"];
        
        if (int.TryParse(delayStr, out _delayInSeconds)) {
            _log.LogInformation("Success on getting delay value from config: {delay} seconds", _delayInSeconds);
        } else {
            _delayInSeconds = 180;
            _log.LogInformation("Fail on getting delay value from config: {delay} seconds(default)", _delayInSeconds);
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int delay = _delayInSeconds * 1000;
        _log.LogInformation("GenAiQueueCleaner woker start - delay: {delay}(miliseconds)", delay);
        _log.LogInformation("Connecting to RabbitMQ");
        using (var conn = await _rbmqConnectionFactory.CreateConnectionAsync()) 
        using (var channel = await conn.CreateChannelAsync())  {
            await channel.QueueDeclareAsync(
                queue: WORKS_TTS_COMPLETED_QUEUE, 
                durable: false,
                exclusive: false,
                autoDelete: false);
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Handle(channel);   
                    await Task.Delay(delay);
                }
                catch (System.Exception ex)
                {
                    _log.LogCritical("Unknowed erro: {m}\n {s}", ex.Message, ex.StackTrace);
                }
            }
        }
        _log.LogInformation("Connection to RabbitMQ closed");
        _log.LogInformation("GenAiQueueCleaner woker stop");
    }

    async Task Handle(IChannel channel) {
        List<BasicGetResult> resultsToNACK = new();
        int removed = 0;
        while (true)
        {
            _log.LogInformation("Geting from queue finished requests");
            BasicGetResult? getResult = await channel.BasicGetAsync(
                queue: WORKS_TTS_COMPLETED_QUEUE, 
                autoAck: false);
            if (getResult is null) {
                _log.LogInformation("No requests finished found");
                break;
            }
            string workId = Encoding.ASCII.GetString(getResult.Body.ToArray());
            _log.LogInformation("Removing request for work {i} from the memory", workId);
            if (await _genAiService.RemoveWorkInTheList(workId)) {
                _log.LogInformation("Request for work {i} removed from the memory", workId);
                await channel.BasicAckAsync(getResult.DeliveryTag, false);
                _log.LogInformation("Ack send to rabbitmq - work id: {i}", workId);
                removed++;
            } else {
                _log.LogError("Fail to remove work {i} from the memory", workId);
                resultsToNACK.Add(getResult);
            }
        }
        _log.LogInformation("GenAiQueueCleaner has finished processing works in the queue - {r} works removed - {f} remove fails", 
            removed,
            resultsToNACK.Count);
        foreach (var result in resultsToNACK)
            await channel.BasicNackAsync(result.DeliveryTag, false, requeue: true);
        _log.LogInformation("{f} fails remove requeued",resultsToNACK.Count);
    }
}