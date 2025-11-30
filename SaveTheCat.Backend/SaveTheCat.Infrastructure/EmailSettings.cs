namespace SaveTheCat.Infrastructure;

public class EmailSettings
{
    // Esta connection string va al Key Vault
    public string CommunicationServiceConnectionString { get; set; } = string.Empty;
    public string SenderAddress { get; set; } = "DoNotReply@74106ce1-4508-4d4c-bf17-f9f9a8387483.azurecomm.net";
    public string ClientAppUrl { get; set; } = "https://www.savethecatboard.com/";
}