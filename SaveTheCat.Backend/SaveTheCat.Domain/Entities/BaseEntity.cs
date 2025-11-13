namespace SaveTheCat.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public required string Name { get; set; }

    public required Guid ProjectId { get; set; }
    public virtual Project? Project { get; set; }
}
