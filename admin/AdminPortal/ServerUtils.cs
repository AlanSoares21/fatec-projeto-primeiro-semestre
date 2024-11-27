using RabbitMQ.Client;

namespace AdminPortal;

public static class ServerUtils
{
    public static Dictionary<string, string> GetQueryValues<T>(T query) {
        if (query is null)
            return new();
        return query.GetType()
            .GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public)
            .ToDictionary(p => p.Name, p => {
                var propValue = p.GetValue(query, null);
                if (propValue is null)
                    return "";
                string? value = propValue.ToString();
                if (string.IsNullOrEmpty(value))
                    return "";
                return value;
            });
        
    }

    public static ConnectionFactory GetRabbitMQConnectionFactory(IConfiguration config, ILogger log) {
        string? hostname = config["RabbitMQ:Hostname"];
        if (hostname is null) {
            log.LogError("Configuration RabbitMQ:Hostname is empty");
            hostname = "localhost";
        }
        string? password = config["RabbitMQ:Password"];
        if (password is null) {
            log.LogError("Configuration RabbitMQ:Password is empty");
            password = "1234";
        }
        string? user = config["RabbitMQ:User"];
        if (user is null) {
            log.LogError("Configuration RabbitMQ:User is empty");
            user = "user";
        }
        string portStr = config["RabbitMQ:Port"]?? "";
        int port;
        if (!int.TryParse(portStr, out port)) {
            log.LogError("Configuration RabbitMQ:Port could not be parsed to int. value: {v}", portStr);
            port = 4000;
        }
        var fac = new ConnectionFactory {
            HostName = hostname,
            Port = port,
            Password = password,
            UserName = user
        };
        return fac;
    }
}