using AI_Wealth_Management.Models;

namespace AI_Wealth_Management.Service;

public class RecommendationService
{
    public object GenerateRecommendation(InvestmentRequest req)
    {
        string horizon = req.Horizon.ToLower();
        string risk = req.Risk.ToLower();

        List<AssetsDistribution> assetsDistributions;
        string insight;
        if (horizon == "short-term" && risk == "low")
        {
            assetsDistributions = new()
            {
                new("Real Estate", 70, req.Capital * 0.70m),
                new("Gold", 10, req.Capital * 0.10m),
                new("USD/Bonds", 20, req.Capital * 0.20m)
            };
            insight =
                "In a short horizon, stability and liquidity are crucial. USD/Bonds provide predictable returns and protect against sudden market shocks, making them the core holding. Gold can serve as a hedge against unexpected inflation or currency fluctuations, but price swings can still occur in the short run. Real Estate is the least practical here because transaction costs and selling time reduce flexibility.";
        }
        else if (horizon == "long-term" && risk == "low")
        {
            assetsDistributions = new()
            {
                new("Real Estate", 30, req.Capital * 0.30m),
                new("Gold", 50, req.Capital * 0.50m),
                new("USD/Bonds", 20, req.Capital * 0.20m)
            };
            insight =
                "Over many years, Real Estate offers steady capital appreciation and rental income, especially in stable markets. USD/Bonds add a layer of safety with fixed returns, balancing the portfolio against downturns. A moderate allocation to Gold protects against long-term inflation and currency depreciation, though it typically underperforms productive assets over decades.";
        }
        else if (horizon == "short-term" && risk == "high")
        {
            assetsDistributions = new()
            {
                new("Real Estate", 70, req.Capital * 0.70m),
                new("Gold", 20, req.Capital * 0.20m),
                new("USD/Bonds", 10, req.Capital * 0.10m)
            };
            insight =
                "This strategy seeks quick gains from volatility. Gold becomes attractive because it reacts sharply to market sentiment, interest rate moves, and geopolitical tensions, creating trading opportunities. USD/Bonds play only a minor role as a liquidity buffer, since their returns are too stable for high-risk targets. Real Estate is generally unsuitable because flipping properties within a short period carries high transaction costs and market timing risk.";
        }
        else
        {
            assetsDistributions = new()
            {
                new("Real Estate", 50, req.Capital * 0.50m),
                new("Gold", 10, req.Capital * 0.10m),
                new("USD/Bonds", 40, req.Capital * 0.40m)
            };
            insight =
                "This is for aggressive growth seekers willing to accept market cycles. Real Estate development projects or speculative property investments can yield large returns if chosen wisely but face economic and regulatory risks. Gold can experience long multi-year bull and bear phases, rewarding patient investors during inflationary periods but requiring discipline during downturns. A small portion in USD/Bonds provides a safety net to weather market crashes and fund new opportunities.";
        }
        return new RecommendationResponse(new
        {
            AssetsDistribution = assetsDistributions,
            Insight = insight
        });
    }
}