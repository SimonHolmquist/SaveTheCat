namespace SaveTheCat.Application.Dtos;

// DTO para Actualizar la BeatSheet
// No incluimos Title ni Date, ya que se actualizan desde el Proyecto
public record UpdateBeatSheetDto(
    string Logline,
    string Genre,
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