namespace SaveTheCat.Domain.Entities;

public class BeatSheet
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Logline { get; set; }
    public required string Genre { get; set; }
    public required string Date { get; set; } 
    public required string OpeningImage { get; set; }
    public required string ThemeStated { get; set; }
    public required string SetUp { get; set; }
    public required string Catalyst { get; set; }
    public required string Debate { get; set; }
    public required string BreakIntoTwo { get; set; }
    public required string BStory { get; set; }
    public required string FunAndGames { get; set; }
    public required string Midpoint { get; set; }
    public required string BadGuysCloseIn { get; set; }
    public required string AllIsLost { get; set; }
    public required string DarkNightOfTheSoul { get; set; }
    public required string BreakIntoThree { get; set; }
    public required string Finale { get; set; }
    public required string FinalImage { get; set; }

    // Relación 1-a-1 con Proyecto
    public Guid ProjectId { get; set; }
    public virtual Project? Project { get; set; }
}
