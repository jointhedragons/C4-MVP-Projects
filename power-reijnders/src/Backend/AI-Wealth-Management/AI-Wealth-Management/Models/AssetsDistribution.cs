namespace AI_Wealth_Management.Models;

public record AssetsDistribution(string Assets, int Percentage, decimal Amount);
public class AssetItem
{
    public string Name { get; set; } = "";
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
}