var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/calculate-portfolio", (InvestmentInput request) =>
{
    var distribution = new List<DistributionItem>();
    string insight = "";

    // Case 1: Long-term, Low-risk
    if (request.Horizon == "long-term" && request.Risk == "low")
    {
        insight = "An excellent investment plan to preserve your capital and grow it steadily long-term. It focuses on safety while achieving balanced growth.";
        distribution.Add(new DistributionItem { Asset = "Bank Certificates / Deposits", Percentage = 30, Amount = request.Capital * 0.30m });
        distribution.Add(new DistributionItem { Asset = "Real Estate", Percentage = 30, Amount = request.Capital * 0.30m });
        distribution.Add(new DistributionItem { Asset = "Gold", Percentage = 20, Amount = request.Capital * 0.20m });
        distribution.Add(new DistributionItem { Asset = "Stock Market Mutual Funds", Percentage = 20, Amount = request.Capital * 0.20m });
    }
    // Case 2: Long-term, High-risk
    else if (request.Horizon == "long-term" && request.Risk == "high")
    {
        insight = "This plan is designed to achieve the highest possible returns long-term. Be prepared for market fluctuations, as big opportunities come with their risks!";
        distribution.Add(new DistributionItem { Asset = "Stock Mutual Funds (Egypt)", Percentage = 40, Amount = request.Capital * 0.40m });
        distribution.Add(new DistributionItem { Asset = "International Stocks / ETFs", Percentage = 30, Amount = request.Capital * 0.30m });
        distribution.Add(new DistributionItem { Asset = "Startups & Small Businesses", Percentage = 15, Amount = request.Capital * 0.15m });
        distribution.Add(new DistributionItem { Asset = "Gold & Silver", Percentage = 15, Amount = request.Capital * 0.15m });
    }
    // Case 3: Short-term, Low-risk
    else if (request.Horizon == "short-term" && request.Risk == "low")
    {
        insight = "The goal here is absolute security and keeping your money liquid and ready for use in the short term. This is the most suitable plan to protect your money from any risk.";
        distribution.Add(new DistributionItem { Asset = "Government Treasury Bills", Percentage = 70, Amount = request.Capital * 0.70m });
        distribution.Add(new DistributionItem { Asset = "Money Market Funds", Percentage = 30, Amount = request.Capital * 0.30m });
    }
    // Case 4: Short-term, High-risk
    else if (request.Horizon == "short-term" && request.Risk == "high")
    {
        insight = "This is a plan for speculation and those seeking quick profits. The risk here is very high, so only invest what you are prepared to lose.";
        distribution.Add(new DistributionItem { Asset = "Speculative Stocks (Local/Global)", Percentage = 35, Amount = request.Capital * 0.35m });
        distribution.Add(new DistributionItem { Asset = "Cryptocurrency", Percentage = 35, Amount = request.Capital * 0.35m });
        distribution.Add(new DistributionItem { Asset = "Silver", Percentage = 15, Amount = request.Capital * 0.15m });
        distribution.Add(new DistributionItem { Asset = "Cash", Percentage = 15, Amount = request.Capital * 0.15m });
    }
    else
    {
        insight = "Invalid inputs. Please choose from the available options.";
        distribution.Add(new DistributionItem { Asset = "N/A", Percentage = 100, Amount = request.Capital });
    }

    var responseData = new
    {
        data = new
        {
            distribution,
            insight,
            timestamp = DateTime.UtcNow
        }
    };

    return Results.Ok(responseData);
})
.WithName("CalculatePortfolio")
.WithOpenApi();

app.Run();

// -----------------------------------------------------------------
//                          Class Definitions
// -----------------------------------------------------------------

public class InvestmentInput
{
    public decimal Capital { get; set; }
    public required string Horizon { get; set; }
    public required string Risk { get; set; }
}

public class DistributionItem
{
    public required string Asset { get; set; }
    public int Percentage { get; set; }
    public decimal Amount { get; set; }
}