namespace SaveTheCat.Infrastructure;

public class EmailSettings
{
    // Esta connection string va al Key Vault
    public string CommunicationServiceConnectionString { get; set; } = string.Empty;
    public string SenderAddress { get; set; } = "no-reply@tudominio.azurecomm.net";
    public string ClientAppUrl { get; set; } = string.Empty;
}