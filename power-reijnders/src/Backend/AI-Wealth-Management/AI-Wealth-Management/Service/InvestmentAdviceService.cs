using System.Text;
using System.Text.Json;
using AI_Wealth_Management.Models;

namespace AI_Wealth_Management.Service;

public class InvestmentAdviceService : IInvestmentAdviceService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public InvestmentAdviceService(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    public async Task<string> GetAdviceAsync(InvestmentRequest req)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_config["Groq:ApiKey"]}");

        var prompt = $@"
        You are a professional financial advisor.

        Capital: {req.Capital:C}
        Investment horizon: {req.Horizon} term
        Risk tolerance: {req.Risk} risk

        Please provide:
        1. Recommended percentage allocation of my total capital across:
        - Real Estate
        - Gold
        - USD/Bonds

        2. Specific stock recommendations (company name + ticker) that are:
        - Environmentally responsible (do not harm the planet or people)
        - Have solid growth or stability potential matching my profile
        - Include each stock's **current market price** (latest available price in USD)

        3. A brief reasoning for each allocation and each stock suggestion.

        Format:
        - Use clear bullet points
        - Show percentages for each allocation
        - List each stock with:
            - Ticker
            - Current market price
            - One-sentence explanation of why it qualifies
        ";


        var payload = new
        {
            model = "llama-3.3-70b-versatile",
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(payload);
        var response = await client.PostAsync(
            "https://api.groq.com/openai/v1/chat/completions",
            new StringContent(json, Encoding.UTF8, "application/json")
        );

        response.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var answer = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return answer;
    }
}
