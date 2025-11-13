namespace SaveTheCat.Application.Dtos;

// DTO para Devolver la BeatSheet
public record BeatSheetDto(
    Guid Id,
    Guid ProjectId,
    string Title,
    string Logline,
    string Genre,
    string Date,
    string OpeningImage,
    string ThemeStated,
    string SetUp,
    string Catalyst,
    string Debate,
    string BreakIntoTwo,
    string BStory,
    string FunAndGames,
    string Midpoint,
    string BadGuysCloseIn,
    string AllIsLost,
    string DarkNightOfTheSoul,
    string BreakIntoThree,
    string Finale,
    string FinalImage
);
