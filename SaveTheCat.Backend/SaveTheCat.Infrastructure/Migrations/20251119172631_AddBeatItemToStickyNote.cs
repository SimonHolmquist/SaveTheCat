using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SaveTheCat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBeatItemToStickyNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BeatItem",
                table: "StickyNotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeatItem",
                table: "StickyNotes");
        }
    }
}
